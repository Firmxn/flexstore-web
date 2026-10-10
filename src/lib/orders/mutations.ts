import { Prisma, type OrderStatus } from "@prisma/client";
import { getCartRawItems, getGuestCart, setGuestCart, type CartIdentity } from "@/lib/cart";
import { prisma } from "@/lib/db/prisma";
import { getInvoiceDurationSeconds } from "@/lib/payments/config";
import { calculateShippingQuote, getShippingSettings } from "@/lib/shipping";
import { calculateDiscount, resolveVouchers } from "@/lib/vouchers";
import { generateOrderNumber } from "./number";
import { releaseExpiredReservations } from "./reservations";
import type { ShippingAddress } from "./validation";

// Reservasi stok memakai masa bayar invoice Xendit (PH-04) supaya stok tidak
// dilepas saat pembeli masih bisa membayar. Nilainya dari env
// `XENDIT_INVOICE_DURATION` (lihat src/lib/payments/config.ts).

export type CreateOrderErrorCode =
  | "CART_EMPTY"
  | "VARIANT_NOT_FOUND"
  | "PRODUCT_INACTIVE"
  | "INSUFFICIENT_STOCK"
  | "INVALID_SHIPPING_METHOD"
  | "INVALID_VOUCHER";

export type CreateOrderError = {
  ok: false;
  code: CreateOrderErrorCode;
  message: string;
  field?: string;
};

export type CreatedOrder = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
};

export type CreateOrderResult =
  | { ok: true; order: CreatedOrder }
  | CreateOrderError;

export type CreateOrderInput = {
  identity: CartIdentity;
  variantIds: string[];
  address: ShippingAddress;
  destinationId: string;
  courierCode: string;
  service: string;
  voucherCodes: string[];
  guestPhone: string | null;
  guestEmail: string | null;
};

// Dilempar dari dalam transaksi supaya perubahan stok ikut dibatalkan.
class OrderCreationError extends Error {
  constructor(
    readonly code: CreateOrderErrorCode,
    message: string,
    readonly field?: string,
  ) {
    super(message);
    this.name = "OrderCreationError";
  }
}

type OrderLine = {
  variantId: string;
  quantity: number;
  price: number;
  weightGram: number;
  productId: string;
  productName: string;
  variantName: string;
  sku: string;
};

type LoadLinesResult = { ok: true; lines: OrderLine[] } | CreateOrderError;

// Harga dan stok diambil dari varian saat ini (bukan snapshot keranjang) supaya
// pesanan selalu memakai harga live (PRD 3.1.B: validasi harga server-side).
async function loadOrderLines(
  identity: CartIdentity,
  variantIds: string[],
): Promise<LoadLinesResult> {
  const rawItems = await getCartRawItems(identity);
  if (rawItems.length === 0) {
    return { ok: false, code: "CART_EMPTY", message: "Keranjang kosong" };
  }

  const cartMap = new Map(rawItems.map((item) => [item.variantId, item]));
  const missing = variantIds.filter((variantId) => !cartMap.has(variantId));
  if (missing.length > 0) {
    return {
      ok: false,
      code: "VARIANT_NOT_FOUND",
      message: "Produk tidak ditemukan",
      field: "variantIds",
    };
  }

  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: { product: { select: { id: true, name: true, status: true } } },
  });
  const variantMap = new Map(variants.map((variant) => [variant.id, variant]));

  const lines: OrderLine[] = [];
  for (const variantId of variantIds) {
    const variant = variantMap.get(variantId);
    if (!variant) {
      return {
        ok: false,
        code: "VARIANT_NOT_FOUND",
        message: "Produk tidak ditemukan",
        field: "variantIds",
      };
    }
    if (variant.product.status !== "ACTIVE") {
      return {
        ok: false,
        code: "PRODUCT_INACTIVE",
        message: "Produk tidak tersedia",
        field: "variantIds",
      };
    }

    const quantity = cartMap.get(variantId)?.quantity ?? 0;
    if (variant.stock < quantity) {
      return {
        ok: false,
        code: "INSUFFICIENT_STOCK",
        message: `Stok ${variant.product.name} tidak cukup (tersisa ${variant.stock})`,
        field: "variantIds",
      };
    }

    lines.push({
      variantId,
      quantity,
      price: Number(variant.price),
      weightGram: variant.weightGram,
      productId: variant.product.id,
      productName: variant.product.name,
      variantName: variant.name,
      sku: variant.sku,
    });
  }

  return { ok: true, lines };
}

// Nomor pesanan dicek dulu supaya bentrok (sangat jarang) tidak membatalkan
// transaksi yang sudah mengurangi stok.
async function pickOrderNumber(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = generateOrderNumber();
    const existing = await prisma.order.findUnique({
      where: { orderNumber: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }
  return generateOrderNumber();
}

// Nomor HP pembeli untuk batas pemakaian voucher per nomor: guest memakai
// nomor terverifikasi, customer memakai nomor akun.
async function resolveBuyerPhone(
  identity: CartIdentity,
  guestPhone: string | null,
): Promise<string | null> {
  if (identity.kind === "guest") return guestPhone;
  const user = await prisma.user.findUnique({
    where: { id: identity.userId },
    select: { phone: true },
  });
  return user?.phone ?? null;
}

// Item keranjang guest disimpan di Redis, di luar transaksi database. Kegagalan
// di sini tidak membatalkan pesanan; sisa item akan dibersihkan saat keranjang
// ditulis berikutnya.
async function removeGuestCartItems(
  guestId: string,
  variantIds: string[],
): Promise<void> {
  const items = await getGuestCart(guestId);
  const wanted = new Set(variantIds);
  await setGuestCart(
    guestId,
    items.filter((item) => !wanted.has(item.variantId)),
  );
}

export async function createOrder(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  // Lepas reservasi yang kedaluwarsa lebih dulu agar stoknya bisa dipakai.
  await releaseExpiredReservations();

  const loaded = await loadOrderLines(input.identity, input.variantIds);
  if (!loaded.ok) return loaded;
  const { lines } = loaded;

  const settings = getShippingSettings();
  const fallbackGram = settings.weightPerItemGram;
  const weightGram = lines.reduce(
    (total, line) =>
      total + line.quantity * (line.weightGram > 0 ? line.weightGram : fallbackGram),
    0,
  );

  // Ongkir dihitung ulang di server; biaya dari klien tidak pernah dipercaya.
  const quote = await calculateShippingQuote(input.destinationId, weightGram);
  const option = quote.options.find(
    (candidate) =>
      candidate.code === input.courierCode && candidate.service === input.service,
  );
  if (!option) {
    return {
      ok: false,
      code: "INVALID_SHIPPING_METHOD",
      message: "Metode pengiriman tidak valid",
      field: "service",
    };
  }

  const subtotal = lines.reduce(
    (total, line) => total + line.price * line.quantity,
    0,
  );
  const shippingCost = option.cost;

  // Voucher dihitung ulang di server dari keranjang dan ongkir final; kode dari
  // klien hanya sebagai masukan (PRD 5.3, AC-ORDER-01-03).
  const buyerPhone = await resolveBuyerPhone(input.identity, input.guestPhone);
  const resolved = await resolveVouchers(input.voucherCodes, {
    subtotal,
    shippingCost,
    phone: buyerPhone,
  });
  if (!resolved.ok) {
    return {
      ok: false,
      code: "INVALID_VOUCHER",
      message: resolved.errors[0]?.reason ?? "Voucher tidak valid",
      field: "voucherCodes",
    };
  }

  const discount = calculateDiscount(resolved.vouchers, subtotal, shippingCost);
  const total = subtotal + shippingCost - discount.totalDiscount;
  const orderNumber = await pickOrderNumber();
  const stockReservedUntil = new Date(
    Date.now() + getInvoiceDurationSeconds() * 1000,
  );

  try {
    const created = await prisma.$transaction(async (tx) => {
      // Reservasi stok atomik: `stock >= qty` dan pengurangan dilakukan dalam
      // satu pernyataan, jadi dua pesanan berbarengan tidak bisa overselling.
      for (const line of lines) {
        const reserved = await tx.productVariant.updateMany({
          where: { id: line.variantId, stock: { gte: line.quantity } },
          data: { stock: { decrement: line.quantity } },
        });
        if (reserved.count === 0) {
          throw new OrderCreationError(
            "INSUFFICIENT_STOCK",
            `Stok ${line.productName} tidak cukup`,
            "variantIds",
          );
        }
      }

      const productIds = [...new Set(lines.map((line) => line.productId))];
      for (const productId of productIds) {
        const rows = await tx.productVariant.findMany({
          where: { productId },
          select: { stock: true },
        });
        await tx.product.update({
          where: { id: productId },
          data: { totalStock: rows.reduce((sum, row) => sum + row.stock, 0) },
        });
      }

      const order = await tx.order.create({
        data: {
          orderNumber,
          userId:
            input.identity.kind === "user" ? input.identity.userId : null,
          guestPhone: input.guestPhone,
          guestEmail: input.guestEmail,
          subtotal,
          shippingCost,
          discount: discount.totalDiscount,
          total,
          shippingAddress: input.address as Prisma.InputJsonValue,
          shippingCourier: option.courier,
          shippingService: option.service,
          shippingEtd: option.etd,
          stockReservedUntil,
          items: {
            create: lines.map((line) => ({
              variantId: line.variantId,
              productName: line.productName,
              variantName: line.variantName,
              sku: line.sku,
              price: line.price,
              quantity: line.quantity,
              weightGram: line.weightGram,
            })),
          },
        },
      });

      if (input.identity.kind === "user") {
        await tx.cartItem.deleteMany({
          where: {
            userId: input.identity.userId,
            variantId: { in: input.variantIds },
          },
        });
      }

      // Catat pemakaian voucher dan tambah kuota terpakai. Penambahan dijaga
      // syarat `usageCount < usageLimit` supaya kuota tidak terlewati walau ada
      // pesanan berbarengan; kegagalan membatalkan seluruh transaksi.
      for (const entry of discount.breakdown) {
        const voucher = resolved.vouchers.find(
          (candidate) => candidate.id === entry.voucherId,
        );
        const where =
          voucher?.usageLimit != null
            ? { id: entry.voucherId, usageCount: { lt: voucher.usageLimit } }
            : { id: entry.voucherId };
        const bumped = await tx.voucher.updateMany({
          where,
          data: { usageCount: { increment: 1 } },
        });
        if (bumped.count === 0) {
          throw new OrderCreationError(
            "INVALID_VOUCHER",
            "Kuota voucher sudah habis",
            "voucherCodes",
          );
        }
      }

      if (discount.breakdown.length > 0) {
        await tx.voucherUsage.createMany({
          data: discount.breakdown.map((entry) => ({
            voucherId: entry.voucherId,
            orderId: order.id,
            phone: buyerPhone,
            amount: entry.amount,
          })),
          skipDuplicates: true,
        });
      }

      return order;
    });

    if (input.identity.kind === "guest") {
      await removeGuestCartItems(input.identity.guestId, input.variantIds);
    }

    return {
      ok: true,
      order: {
        id: created.id,
        orderNumber: created.orderNumber,
        status: created.status,
        subtotal,
        shippingCost,
        discount: discount.totalDiscount,
        total,
      },
    };
  } catch (error) {
    if (error instanceof OrderCreationError) {
      return {
        ok: false,
        code: error.code,
        message: error.message,
        field: error.field,
      };
    }
    throw error;
  }
}
