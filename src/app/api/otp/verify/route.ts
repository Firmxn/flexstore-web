import { verifyOtp } from "@/lib/auth/otp";
import { verifyOtpSchema } from "@/lib/auth/validation";
import { apiError, apiSuccess, serverError, validationError } from "@/lib/utils/api";

const FAILURE_RESPONSES = {
  EXPIRED: { code: "OTP_EXPIRED", message: "Kode OTP expired", status: 410 },
  INVALID: { code: "OTP_INVALID", message: "Kode OTP salah", status: 400 },
  TOO_MANY_ATTEMPTS: {
    code: "TOO_MANY_ATTEMPTS",
    message: "Terlalu banyak percobaan",
    status: 429,
  },
} as const;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = verifyOtpSchema.safeParse(body);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  let result;
  try {
    result = await verifyOtp(parsed.data.phone, parsed.data.code);
  } catch (error) {
    console.error("[api/otp/verify] error tak terduga", error);
    return serverError();
  }

  if (!result.ok) {
    const failure = FAILURE_RESPONSES[result.reason];
    return apiError(failure.code, failure.message, failure.status);
  }

  return apiSuccess({ verified: true, phone: parsed.data.phone });
}
