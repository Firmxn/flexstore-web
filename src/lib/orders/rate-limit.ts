import { redis } from "@/lib/redis/client";

// Lacak pesanan publik dibatasi per alamat IP supaya nomor pesanan tidak bisa
// ditebak berulang kali (OWASP A04: Insecure Design / penyalahgunaan).
const TRACK_MAX_ATTEMPTS = 10;
const TRACK_WINDOW_SECONDS = 10 * 60;

export function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || null;
}

// Tanpa IP (dev, tanpa proxy) pembatasan dilewati. Redis gagal juga dilewati
// supaya fitur tetap berjalan (degrade gracefully).
export async function allowTrackAttempt(ip: string | null): Promise<boolean> {
  if (!ip) return true;
  try {
    const key = `track:limit:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, TRACK_WINDOW_SECONDS);
    return count <= TRACK_MAX_ATTEMPTS;
  } catch (error) {
    console.error("[orders] pembatasan lacak gagal, dilewati", error);
    return true;
  }
}
