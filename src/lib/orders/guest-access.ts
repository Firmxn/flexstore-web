import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

// Akses guest ke halaman pesanan tanpa login. Setelah checkout (guest sudah
// lolos OTP), server menerbitkan cookie bertanda-tangan berisi nomor HP
// terverifikasi. Cookie ini BUKAN sesi login: hanya bukti bahwa browser ini
// yang membuat pesanan, dan hanya membuka pesanan dengan `guestPhone` yang
// sama. Ditandatangani HMAC AUTH_SECRET supaya tidak bisa dipalsukan klien.
export const GUEST_ACCESS_COOKIE = "flexstore_guest_access";
export const GUEST_ACCESS_TTL_SECONDS = 24 * 60 * 60;

type GuestAccessPayload = { phone: string; exp: number };

function getSecret(): string {
  const secret = process.env.AUTH_SECRET?.trim();
  if (!secret) throw new Error("AUTH_SECRET belum diisi di .env.local");
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createGuestAccessToken(phone: string): string {
  const payload = Buffer.from(
    JSON.stringify({
      phone,
      exp: Math.floor(Date.now() / 1000) + GUEST_ACCESS_TTL_SECONDS,
    } satisfies GuestAccessPayload),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

// Kembalikan nomor HP kalau tanda tangan sah dan belum kedaluwarsa; null kalau
// tidak. Perbandingan tanda tangan memakai timingSafeEqual (OWASP A02/A07).
export function verifyGuestAccessToken(
  token: string | undefined | null,
): string | null {
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const given = Buffer.from(signature);
  const expected = Buffer.from(sign(payload));
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as Partial<GuestAccessPayload>;
    if (typeof parsed.phone !== "string" || typeof parsed.exp !== "number") {
      return null;
    }
    if (parsed.exp * 1000 <= Date.now()) return null;
    return parsed.phone;
  } catch {
    return null;
  }
}

export function attachGuestAccessCookie(
  response: NextResponse,
  phone: string,
): void {
  response.cookies.set(GUEST_ACCESS_COOKIE, createGuestAccessToken(phone), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: GUEST_ACCESS_TTL_SECONDS,
  });
}

// Dipakai Server Component halaman pesanan untuk mengenali guest.
export async function getGuestAccessPhone(): Promise<string | null> {
  const store = await cookies();
  return verifyGuestAccessToken(store.get(GUEST_ACCESS_COOKIE)?.value);
}
