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
// CUST-03 (PH-10): verifikasi email baru. TTL 24 jam, hanya satu tautan aktif
// per akun, dan dibatasi 3 permintaan per jam per akun (docs/03 CUST-03 bagian 13).
const EMAIL_CHANGE_TTL_SECONDS = 24 * 60 * 60;
const EMAIL_CHANGE_LIMIT_WINDOW_SECONDS = 60 * 60;
const MAX_EMAIL_CHANGE_REQUESTS = 3;

const setPasswordKey = (token: string) => `auth:set-password:${token}`;
const resetPasswordKey = (token: string) => `auth:reset-password:${token}`;
const forgotLimitKey = (email: string) => `auth:forgot-limit:${email}`;
const emailChangeKey = (token: string) => `auth:email-change:${token}`;
const emailChangeUserKey = (userId: string) => `auth:email-change-user:${userId}`;
const emailChangeLimitKey = (userId: string) => `auth:email-change-limit:${userId}`;

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

export type EmailChangePayload = {
  userId: string;
  newEmail: string;
};

// CUST-03: tautan verifikasi email baru. Hanya satu tautan aktif per akun —
// permintaan baru membatalkan tautan sebelumnya (docs/03 CUST-03 bagian 7).
export async function createEmailChangeToken(
  userId: string,
  newEmail: string,
): Promise<string> {
  const previous = await redis.get<string>(emailChangeUserKey(userId));
  if (typeof previous === "string" && previous) {
    await redis.del(emailChangeKey(previous));
  }

  const token = newToken();
  await redis.set(
    emailChangeKey(token),
    JSON.stringify({ userId, newEmail } satisfies EmailChangePayload),
    { ex: EMAIL_CHANGE_TTL_SECONDS },
  );
  await redis.set(emailChangeUserKey(userId), token, {
    ex: EMAIL_CHANGE_TTL_SECONDS,
  });
  return token;
}

// Sekali pakai: token dihapus saat dibaca, begitu juga indeks pemetaan akun.
export async function consumeEmailChangeToken(
  token: string,
): Promise<EmailChangePayload | null> {
  const key = emailChangeKey(token);
  const raw = await redis.get<EmailChangePayload | string>(key);
  if (!raw) return null;
  await redis.del(key);

  try {
    const parsed =
      typeof raw === "string" ? (JSON.parse(raw) as EmailChangePayload) : raw;
    if (
      typeof parsed?.userId !== "string" ||
      typeof parsed?.newEmail !== "string"
    ) {
      return null;
    }
    await redis.del(emailChangeUserKey(parsed.userId));
    return { userId: parsed.userId, newEmail: parsed.newEmail };
  } catch {
    return null;
  }
}

// Batas permintaan ganti email per akun (OWASP A07/A04): melebihi batas
// ditolak di route dengan 429 supaya email baru tidak dispam tautan.
export async function isEmailChangeRateLimited(userId: string): Promise<boolean> {
  const key = emailChangeLimitKey(userId);
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, EMAIL_CHANGE_LIMIT_WINDOW_SECONDS);
  }
  return count > MAX_EMAIL_CHANGE_REQUESTS;
}
