import { redis } from "@/lib/redis/client";
import { GUEST_CART_TTL_SECONDS } from "./session";

// Keranjang guest disimpan utuh sebagai satu dokumen JSON. Jumlah item kecil
// (puluhan), jadi baca-tulis penuh lebih sederhana daripada hash per item.
export type GuestCartItem = {
  variantId: string;
  quantity: number;
  price: number;
};

const guestCartKey = (guestId: string) => `cart:guest:${guestId}`;

export async function getGuestCart(guestId: string): Promise<GuestCartItem[]> {
  const items = await redis.get<GuestCartItem[]>(guestCartKey(guestId));
  if (!Array.isArray(items)) return [];
  return items.filter(
    (item) =>
      item &&
      typeof item.variantId === "string" &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      typeof item.price === "number",
  );
}

export async function setGuestCart(
  guestId: string,
  items: GuestCartItem[],
): Promise<void> {
  if (items.length === 0) {
    await redis.del(guestCartKey(guestId));
    return;
  }
  await redis.set(guestCartKey(guestId), items, {
    ex: GUEST_CART_TTL_SECONDS,
  });
}

export async function deleteGuestCart(guestId: string): Promise<void> {
  await redis.del(guestCartKey(guestId));
}
