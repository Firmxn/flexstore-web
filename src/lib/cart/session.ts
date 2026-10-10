import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import type { Role } from "@prisma/client";
import { auth } from "@/lib/auth";

// Guest dikenali lewat cookie berisi UUID acak; isi keranjangnya ada di Redis
// (`cart:guest:{id}`). Customer dikenali lewat sesi NextAuth dan keranjangnya
// disimpan di tabel `cart_items`.
export const GUEST_CART_COOKIE = "flexstore_cart";
export const GUEST_CART_TTL_SECONDS = 30 * 24 * 60 * 60;

export type CartIdentity =
  | { kind: "user"; userId: string }
  | { kind: "guest"; guestId: string };

// Hasil resolusi akses keranjang. `ok: false` dipisahkan dari "tanpa identitas"
// supaya sesi dengan role non-customer (mis. STORE_ADMIN) TIDAK diperlakukan
// sebagai guest — kalau tidak, admin justru akan mendapat keranjang guest baru.
export type CartAccess =
  | { ok: true; identity: CartIdentity | null }
  | { ok: false; role: Role };

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Nilai cookie guest wajib UUID valid supaya nilai sampah tidak pernah dijadikan
// kunci Redis. Dipakai `getCartAccess` dan route `/api/cart/sync`.
export function isGuestCartId(value: string): boolean {
  return UUID_PATTERN.test(value);
}

// Hanya customer (sesi) dan guest (tanpa sesi) yang boleh berbelanja
// (PRD 2: role Guest, Customer, Store Admin). Role lain ditolak eksplisit.
export async function getCartAccess(): Promise<CartAccess> {
  const session = await auth();
  const user = session?.user;

  if (user) {
    if (user.role !== "CUSTOMER") return { ok: false, role: user.role };
    return { ok: true, identity: { kind: "user", userId: user.id } };
  }

  const store = await cookies();
  const guestId = store.get(GUEST_CART_COOKIE)?.value;
  if (guestId && isGuestCartId(guestId)) {
    return { ok: true, identity: { kind: "guest", guestId } };
  }
  return { ok: true, identity: null };
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
