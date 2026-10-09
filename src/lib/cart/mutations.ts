import { prisma } from "@/lib/db/prisma";
import { deleteGuestCart, getGuestCart, setGuestCart } from "./guest";
import type { CartIdentity } from "./session";

export type CartMutationError = {
  ok: false;
  code: "VARIANT_NOT_FOUND" | "PRODUCT_INACTIVE" | "INSUFFICIENT_STOCK";
  message: string;
  remaining?: number;
};

export type CartMutationSuccess = { ok: true };
export type CartMutationResult = CartMutationSuccess | CartMutationError;

const variantInclude = { product: true } as const;

async function getVariantForCart(variantId: string) {
  return prisma.productVariant.findUnique({
    where: { id: variantId },
    include: variantInclude,
  });
}

type CartVariant = NonNullable<Awaited<ReturnType<typeof getVariantForCart>>>;

type VariantCheck = { ok: true; variant: CartVariant } | CartMutationError;

function checkVariant(variant: CartVariant | null): VariantCheck {
  if (!variant) {
    return {
      ok: false,
      code: "VARIANT_NOT_FOUND",
      message: "Produk tidak ditemukan",
    };
  }
  if (variant.product.status !== "ACTIVE") {
    return {
      ok: false,
      code: "PRODUCT_INACTIVE",
      message: "Produk tidak tersedia",
    };
  }
  return { ok: true, variant };
}

// Tambah item: kalau varian sudah ada di cart, kuantitas diakumulasi
// (alur alternatif CART-01). Snapshot harga diambil saat item pertama kali
// masuk cart; harga live divalidasi ulang saat checkout (PH-03).
export async function addToCart(
  identity: CartIdentity,
  variantId: string,
  quantity: number,
): Promise<CartMutationResult> {
  const checked = checkVariant(await getVariantForCart(variantId));
  if (!checked.ok) return checked;
  const { variant } = checked;

  if (identity.kind === "guest") {
    const items = await getGuestCart(identity.guestId);
    const existing = items.find((item) => item.variantId === variantId);
    const currentQuantity = existing?.quantity ?? 0;

    const remaining = variant.stock - currentQuantity;
    if (quantity > remaining) {
      return {
        ok: false,
        code: "INSUFFICIENT_STOCK",
        message: `Stok tidak cukup (tersisa ${Math.max(remaining, 0)})`,
        remaining: Math.max(remaining, 0),
      };
    }

    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ variantId, quantity, price: Number(variant.price) });
    }
    await setGuestCart(identity.guestId, items);
    return { ok: true };
  }

  const existing = await prisma.cartItem.findUnique({
    where: { userId_variantId: { userId: identity.userId, variantId } },
  });
  const currentQuantity = existing?.quantity ?? 0;

  const remaining = variant.stock - currentQuantity;
  if (quantity > remaining) {
    return {
      ok: false,
      code: "INSUFFICIENT_STOCK",
      message: `Stok tidak cukup (tersisa ${Math.max(remaining, 0)})`,
      remaining: Math.max(remaining, 0),
    };
  }

  await prisma.cartItem.upsert({
    where: { userId_variantId: { userId: identity.userId, variantId } },
    create: {
      userId: identity.userId,
      variantId,
      quantity,
      price: variant.price,
    },
    update: { quantity: { increment: quantity } },
  });
  return { ok: true };
}

export async function updateCartItem(
  identity: CartIdentity,
  variantId: string,
  quantity: number,
): Promise<CartMutationResult> {
  const checked = checkVariant(await getVariantForCart(variantId));
  if (!checked.ok) return checked;
  const { variant } = checked;

  if (quantity > variant.stock) {
    return {
      ok: false,
      code: "INSUFFICIENT_STOCK",
      message: `Stok tidak cukup (tersisa ${variant.stock})`,
      remaining: variant.stock,
    };
  }

  if (identity.kind === "guest") {
    const items = await getGuestCart(identity.guestId);
    const existing = items.find((item) => item.variantId === variantId);
    if (!existing) {
      return {
        ok: false,
        code: "VARIANT_NOT_FOUND",
        message: "Item tidak ada di keranjang",
      };
    }
    existing.quantity = quantity;
    await setGuestCart(identity.guestId, items);
    return { ok: true };
  }

  // updateMany dipakai supaya baris yang tidak ada tidak melempar P2025.
  // Jalur guest sudah mengembalikan VARIANT_NOT_FOUND; jalur customer disamakan
  // supaya keduanya 404, bukan 500.
  const updated = await prisma.cartItem.updateMany({
    where: { userId: identity.userId, variantId },
    data: { quantity },
  });
  if (updated.count === 0) {
    return {
      ok: false,
      code: "VARIANT_NOT_FOUND",
      message: "Item tidak ada di keranjang",
    };
  }
  return { ok: true };
}

export async function removeFromCart(
  identity: CartIdentity,
  variantId: string,
): Promise<CartMutationResult> {
  if (identity.kind === "guest") {
    const items = await getGuestCart(identity.guestId);
    await setGuestCart(
      identity.guestId,
      items.filter((item) => item.variantId !== variantId),
    );
    return { ok: true };
  }

  await prisma.cartItem.deleteMany({
    where: { userId: identity.userId, variantId },
  });
  return { ok: true };
}

// Dipanggil setelah login/registrasi: isi keranjang guest digabung ke
// keranjang customer, lalu keranjang guest dihapus. Item yang variannya sudah
// tidak valid dibuang; kuantitas dibatasi stok terkini.
export async function mergeGuestCartIntoUser(
  userId: string,
  guestId: string,
): Promise<number> {
  const guestItems = await getGuestCart(guestId);
  if (guestItems.length === 0) return 0;

  let merged = 0;
  for (const item of guestItems) {
    const checked = checkVariant(await getVariantForCart(item.variantId));
    if (!checked.ok) continue;
    const { variant } = checked;

    const existing = await prisma.cartItem.findUnique({
      where: { userId_variantId: { userId, variantId: item.variantId } },
    });
    const currentQuantity = existing?.quantity ?? 0;
    const target = Math.min(currentQuantity + item.quantity, variant.stock);
    if (target <= currentQuantity) continue;

    await prisma.cartItem.upsert({
      where: { userId_variantId: { userId, variantId: item.variantId } },
      create: {
        userId,
        variantId: item.variantId,
        quantity: target,
        price: item.price,
      },
      update: { quantity: target },
    });
    merged += 1;
  }

  await deleteGuestCart(guestId);
  return merged;
}
