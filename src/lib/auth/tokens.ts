import { randomBytes } from "node:crypto";
import { redis } from "@/lib/redis/client";

// Token sekali pakai untuk set/reset password (PH-07, AUTH-04/AUTH-05).
// Disimpan di Redis dengan TTL, bukan di cookie, supaya tidak bisa dipalsukan
// klien. Token dihapus saat dibaca sehingga link hanya berlaku sekali
// (AC: token sekali pakai dan berkedaluwarsa).

const SET_PASSWORD_TTL_SECONDS = 24 * 60 * 60;
const RESET_PASSWORD_TTL_SECONDS = 60 * 60;
const FORGOT_LIMIT_WINDOW_SECONDS = 60 * 60;
const MAX_FORGOT_REQUESTS = 3;

const setPasswordKey = (token: string) => `auth:set-password:${token}`;
const resetPasswordKey = (token: string) => `auth:reset-password:${token}`;
const forgotLimitKey = (email: string) => `auth:forgot-limit:${email}`;

export type SetPasswordPayload = {
  email: string;
  name: string;
  phone: string | null;
};

function newToken(): string {
  return randomBytes(32).toString("hex");
}

export async function createSetPasswordToken(
  payload: SetPasswordPayload,
): Promise<string> {
  const token = newToken();
  await redis.set(setPasswordKey(token), JSON.stringify(payload), {
    ex: SET_PASSWORD_TTL_SECONDS,
  });
  return token;
}

export async function consumeSetPasswordToken(
  token: string,
): Promise<SetPasswordPayload | null> {
  const key = setPasswordKey(token);
  const raw = await redis.get<SetPasswordPayload | string>(key);
  if (!raw) return null;
  await redis.del(key);

  try {
    return typeof raw === "string"
      ? (JSON.parse(raw) as SetPasswordPayload)
      : raw;
  } catch {
    return null;
  }
}

export async function createPasswordResetToken(userId: string): Promise<string> {
  const token = newToken();
  await redis.set(resetPasswordKey(token), JSON.stringify({ userId }), {
    ex: RESET_PASSWORD_TTL_SECONDS,
  });
  return token;
}

export async function consumePasswordResetToken(
  token: string,
): Promise<{ userId: string } | null> {
  const key = resetPasswordKey(token);
  const raw = await redis.get<{ userId: string } | string>(key);
  if (!raw) return null;
  await redis.del(key);

  try {
    const parsed =
      typeof raw === "string" ? (JSON.parse(raw) as { userId?: string }) : raw;
    return typeof parsed.userId === "string" ? { userId: parsed.userId } : null;
  } catch {
    return null;
  }
}

// Batas permintaan "lupa password" per email supaya tidak dipakai membanjiri
// kotak masuk (OWASP A07). Melebihi batas tetap dijawab sukses di route supaya
// keberadaan email tidak bocor.
export async function isForgotPasswordRateLimited(
  email: string,
): Promise<boolean> {
  const key = forgotLimitKey(email);
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, FORGOT_LIMIT_WINDOW_SECONDS);
  }
  return count > MAX_FORGOT_REQUESTS;
}
