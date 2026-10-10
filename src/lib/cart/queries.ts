import { prisma } from "@/lib/db/prisma";
import { getGuestCart } from "./guest";
import type { CartIdentity } from "./session";

export type CartLine = {
  variantId: string;
  quantity: number;
  price: number;
  productId: string;
  productName: string;
  productSlug: string;
  productStatus: string;
  variantName: string;
  sku: string;
  stock: number;
  weightGram: number;
  imageUrl: string | null;
};

export type CartSnapshot = {
  items: CartLine[];
  subtotal: number;
  itemCount: number;
};

export const EMPTY_CART: CartSnapshot = { items: [], subtotal: 0, itemCount: 0 };

async function getRawItems(
  identity: CartIdentity,
): Promise<{ variantId: string; quantity: number; price: number }[]> {
  if (identity.kind === "guest") {
    return getGuestCart(identity.guestId);
  }

  const rows = await prisma.cartItem.findMany({
    where: { userId: identity.userId },
    orderBy: { createdAt: "asc" },
  });
  return rows.map((row) => ({
    variantId: row.variantId,
    quantity: row.quantity,
    price: Number(row.price),
  }));
}

// Dipakai checkout (PH-03) untuk membaca isi keranjang mentah: kuantitas dari
// keranjang, sedangkan harga dan berat diambil ulang dari varian saat pesanan
// dibuat. Harga snapshot keranjang tidak dipakai untuk pesanan.
export type RawCartItem = { variantId: string; quantity: number; price: number };

export async function getCartRawItems(
  identity: CartIdentity,
): Promise<RawCartItem[]> {
  return getRawItems(identity);
}

// Keranjang disimpan minimal (variantId, quantity, snapshot harga); info
// produk diperkaya saat dibaca supaya halaman cart selalu menampilkan data
// terbaru (stok, status, gambar).
export async function getCart(identity: CartIdentity): Promise<CartSnapshot> {
  const rawItems = await getRawItems(identity);
  if (rawItems.length === 0) return EMPTY_CART;

  const variants = await prisma.productVariant.findMany({
    where: { id: { in: rawItems.map((item) => item.variantId) } },
    include: {
      product: {
        include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      },
    },
  });
  const variantMap = new Map(variants.map((variant) => [variant.id, variant]));

  // Item yang variannya sudah tidak ada dianggap gugur dari tampilan; datanya
  // dibersihkan saat ada operasi tulis berikutnya.
  const items: CartLine[] = [];
  for (const item of rawItems) {
    const variant = variantMap.get(item.variantId);
    if (!variant) continue;

    items.push({
      variantId: item.variantId,
      quantity: item.quantity,
      price: item.price,
      productId: variant.product.id,
      productName: variant.product.name,
      productSlug: variant.product.slug,
      productStatus: variant.product.status,
      variantName: variant.name,
      sku: variant.sku,
      stock: variant.stock,
      weightGram: variant.weightGram,
      imageUrl: variant.imageUrl ?? variant.product.images[0]?.url ?? null,
    });
  }

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return { items, subtotal, itemCount };
}

export async function getCartItemCount(
  identity: CartIdentity | null,
): Promise<number> {
  if (!identity) return 0;
  const cart = await getCart(identity);
  return cart.itemCount;
}
