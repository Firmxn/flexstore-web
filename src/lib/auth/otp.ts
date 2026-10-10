import { redis } from "@/lib/redis/client";
import twilio from "twilio";

const OTP_TTL_SECONDS = 5 * 60;
const MAX_VERIFY_ATTEMPTS = 3;
const MAX_SENDS_PER_WINDOW = 3;
const SEND_WINDOW_SECONDS = 60 * 60;

const otpKey = (phone: string) => `otp:${phone}`;
const attemptsKey = (phone: string) => `otp:attempts:${phone}`;
const sendLimitKey = (phone: string) => `otp:send-limit:${phone}`;
const verifiedKey = (phone: string) => `phone-verified:${phone}`;

// Penanda "nomor ini sudah lolos OTP" disimpan di Redis (server-side), bukan di
// cookie, supaya checkout guest tidak bisa memalsukan nomor terverifikasi.
// Berlaku 1 jam: cukup untuk mengisi form checkout setelah verifikasi.
const PHONE_VERIFIED_TTL_SECONDS = 60 * 60;

export async function markPhoneVerified(phone: string): Promise<void> {
  try {
    await redis.set(verifiedKey(phone), "1", {
      ex: PHONE_VERIFIED_TTL_SECONDS,
    });
  } catch (error) {
    // Verifikasi tetap dianggap sukses; kegagalan penanda hanya ke log.
    console.error("[otp] gagal menandai nomor terverifikasi", { phone, error });
  }
}

export async function isPhoneVerified(phone: string): Promise<boolean> {
  const value = await redis.get<string>(verifiedKey(phone));
  return value === "1";
}

export type SendOtpResult =
  | { ok: true }
  | { ok: false; reason: "RATE_LIMITED" | "SEND_FAILED" };

export type VerifyOtpResult =
  | { ok: true }
  | { ok: false; reason: "EXPIRED" | "INVALID" | "TOO_MANY_ATTEMPTS" };

// Twilio Verify memberi dua penanda kegagalan: status HTTP (404 saat
// verification sudah hilang dari server) dan kode angka (60202 saat percobaan
// cek habis). Keduanya dibaca untuk memetakan hasil ke alasan aplikasi.
type TwilioRestError = { status?: number; code?: number };

function asTwilioError(error: unknown): TwilioRestError {
  return error as TwilioRestError;
}

function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) {
    throw new Error("Twilio credentials belum diisi di .env.local");
  }
  return twilio(accountSid, authToken);
}

function getVerifyServiceSid(): string {
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID?.trim();
  if (!serviceSid) {
    throw new Error("TWILIO_VERIFY_SERVICE_SID belum diisi di .env.local");
  }
  return serviceSid;
}

// Kanal verifikasi diambil dari TWILIO_VERIFY_CHANNEL; proyek ini memakai `sms`.
function getVerifyChannel(): string {
  return process.env.TWILIO_VERIFY_CHANNEL?.trim() || "sms";
}

type TwilioClient = ReturnType<typeof getTwilioClient>;

// Kirim ulang harus menghasilkan kode baru, sementara Verify memberi kode yang
// sama selama sesi lama masih berlaku. Membatalkan sesi lama memaksa kode
// baru terbit, dan kode lama otomatis tidak berlaku lagi.
async function cancelPreviousVerification(
  client: TwilioClient,
  serviceSid: string,
  phone: string,
): Promise<void> {
  const previousSid = await redis.get<string>(otpKey(phone));
  if (!previousSid) return;

  try {
    await client.verify.v2
      .services(serviceSid)
      .verifications(previousSid)
      .update({ status: "canceled" });
  } catch {
    // Sesi lama sudah kedaluwarsa, disetujui, atau dibatalkan — bukan
    // penghalang pengiriman baru, jadi kegagalannya diabaikan.
  }
}

// Verify mengelola kode, masa berlaku, dan percobaan cek di servernya, jadi
// Redis hanya menyimpan penanda sesi (SID verification, TTL 5 menit) untuk
// mempertahankan batas kedaluwarsa 5 menit yang dijanjikan UI. Default Verify
// sendiri 10 menit.
async function startVerification(phone: string): Promise<void> {
  const client = getTwilioClient();
  const serviceSid = getVerifyServiceSid();

  await cancelPreviousVerification(client, serviceSid, phone);

  const verification = await client.verify.v2
    .services(serviceSid)
    .verifications.create({ to: phone, channel: getVerifyChannel() });

  await redis.set(otpKey(phone), verification.sid, { ex: OTP_TTL_SECONDS });
  await redis.del(attemptsKey(phone));
}

async function consumeFailedAttempt(
  phone: string,
  exhaustedByProvider: boolean,
): Promise<VerifyOtpResult> {
  const attempts = await redis.incr(attemptsKey(phone));
  if (attempts === 1) {
    await redis.expire(attemptsKey(phone), OTP_TTL_SECONDS);
  }

  if (exhaustedByProvider || attempts >= MAX_VERIFY_ATTEMPTS) {
    await redis.del(otpKey(phone));
    return { ok: false, reason: "TOO_MANY_ATTEMPTS" };
  }
  return { ok: false, reason: "INVALID" };
}

async function checkVerification(
  phone: string,
  code: string,
): Promise<VerifyOtpResult> {
  const pendingSid = await redis.get<string>(otpKey(phone));
  if (!pendingSid) {
    return { ok: false, reason: "EXPIRED" };
  }

  const client = getTwilioClient();
  const serviceSid = getVerifyServiceSid();

  try {
    const check = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: phone, code });

    if (check.status === "approved") {
      await redis.del(otpKey(phone));
      await redis.del(attemptsKey(phone));
      await markPhoneVerified(phone);
      return { ok: true };
    }
    if (check.status === "expired") {
      await redis.del(otpKey(phone));
      return { ok: false, reason: "EXPIRED" };
    }
    return await consumeFailedAttempt(
      phone,
      check.status === "max_attempts_reached",
    );
  } catch (error) {
    const { status, code: twilioCode } = asTwilioError(error);

    // 404 berarti verification sudah tidak ada di server: kedaluwarsa, sudah
    // pernah disetujui, atau dihapus setelah percobaan cek habis.
    if (status === 404) {
      await redis.del(otpKey(phone));
      return { ok: false, reason: "EXPIRED" };
    }
    if (twilioCode === 60202) {
      return await consumeFailedAttempt(phone, true);
    }

    console.error("[otp] gagal memeriksa OTP", { phone, error });
    throw error;
  }
}

export async function sendOtp(phone: string): Promise<SendOtpResult> {
  const sendCount = await redis.incr(sendLimitKey(phone));
  if (sendCount === 1) {
    await redis.expire(sendLimitKey(phone), SEND_WINDOW_SECONDS);
  }
  if (sendCount > MAX_SENDS_PER_WINDOW) {
    return { ok: false, reason: "RATE_LIMITED" };
  }

  try {
    await startVerification(phone);
  } catch (error) {
    console.error("[otp] gagal mengirim OTP", { phone, error });
    return { ok: false, reason: "SEND_FAILED" };
  }

  return { ok: true };
}

export async function verifyOtp(
  phone: string,
  code: string,
): Promise<VerifyOtpResult> {
  return await checkVerification(phone, code);
}
