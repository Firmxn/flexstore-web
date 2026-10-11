import { addToCart } from "@/lib/cart";
import { prisma } from "@/lib/db/prisma";
import { isUuid } from "./queries";

// Lanjutan ORDER-03 (PH-07, PRD 2.2): "Pesan Lagi" menambahkan varian dari
// pesanan lama ke keranjang. Tidak ada pesanan baru yang dibuat di sini; stok,
// status produk, dan kuantitas divalidasi ulang saat checkout. Varian yang sudah
// tidak ada atau produknya nonaktif dilewati dengan alasan yang jelas.

export type ReorderSkip = { productName: string; reason: string };

export type ReorderResult =
  | { ok: true; added: number; skipped: ReorderSkip[] }
  | { ok: false; code: "NOT_FOUND" | "NOTHING_ADDED"; message: string };

export async function reorderFromOrder(
  userId: string,
  orderId: string,
): Promise<ReorderResult> {
  if (!isUuid(orderId)) {
    return { ok: false, code: "NOT_FOUND", message: "Pesanan tidak ditemukan" };
  }

  // Hanya pesanan milik user sendiri yang bisa dipesan ulang (OWASP A01).
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: { orderBy: { createdAt: "asc" } } },
  });
  if (!order) {
    return { ok: false, code: "NOT_FOUND", message: "Pesanan tidak ditemukan" };
  }

  const identity = { kind: "user" as const, userId };
  const skipped: ReorderSkip[] = [];
  let added = 0;

  for (const item of order.items) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: item.variantId },
      include: { product: { select: { status: true } } },
    });

    if (!variant || variant.product.status !== "ACTIVE") {
      skipped.push({ productName: item.productName, reason: "Produk tidak tersedia" });
      continue;
    }
    if (variant.stock < 1) {
      skipped.push({ productName: item.productName, reason: "Stok habis" });
      continue;
    }

    const quantity = Math.min(item.quantity, variant.stock);
    const result = await addToCart(identity, item.variantId, quantity);
    if (!result.ok) {
      skipped.push({ productName: item.productName, reason: result.message });
      continue;
    }

    added += 1;
    if (quantity < item.quantity) {
      skipped.push({
        productName: item.productName,
        reason: `Jumlah disesuaikan ke ${quantity} mengikuti stok tersisa`,
      });
    }
  }

  if (added === 0) {
    return {
      ok: false,
      code: "NOTHING_ADDED",
      message: skipped[0]?.reason ?? "Tidak ada item yang bisa ditambahkan",
    };
  }

  return { ok: true, added, skipped };
}
