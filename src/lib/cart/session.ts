import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Guest dikenali lewat cookie berisi UUID acak; isi keranjangnya ada di Redis
// (`cart:guest:{id}`). Customer dikenali lewat sesi NextAuth dan keranjangnya
// disimpan di tabel `cart_items`.
export const GUEST_CART_COOKIE = "flexstore_cart";
export const GUEST_CART_TTL_SECONDS = 30 * 24 * 60 * 60;

export type CartIdentity =
  | { kind: "user"; userId: string }
  | { kind: "guest"; guestId: string };

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Nilai cookie guest wajib UUID valid supaya nilai sampah tidak pernah dijadikan
// kunci Redis. Dipakai `getCartIdentity` dan route `/api/cart/sync`.
export function isGuestCartId(value: string): boolean {
  return UUID_PATTERN.test(value);
}

// User yang sudah login (role apa pun) memakai keranjang database. Cookie
// guest hanya dibaca kalau nilainya UUID, supaya nilai sampah tidak bisa
// membuat kunci Redis liar.
export async function getCartIdentity(): Promise<CartIdentity | null> {
  const session = await auth();
  const userId = session?.user?.id;
  if (userId) return { kind: "user", userId };

  const store = await cookies();
  const guestId = store.get(GUEST_CART_COOKIE)?.value;
  if (guestId && isGuestCartId(guestId)) {
    return { kind: "guest", guestId };
  }
  return null;
}

export function createGuestCartId(): string {
  return randomUUID();
}

// Cookie httpOnly supaya tidak bisa dibaca/diubah JavaScript sisi klien
// (XSS tidak bisa mencuri isi keranjang), Secure di produksi.
export function attachGuestCartCookie(
  response: NextResponse,
  guestId: string,
): void {
  response.cookies.set(GUEST_CART_COOKIE, guestId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: GUEST_CART_TTL_SECONDS,
  });
}
