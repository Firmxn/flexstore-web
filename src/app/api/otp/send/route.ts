import { sendOtp } from "@/lib/auth/otp";
import { sendOtpSchema } from "@/lib/auth/validation";
import { apiError, apiSuccess, validationError, serverError } from "@/lib/utils/api";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = sendOtpSchema.safeParse(body);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  let result;
  try {
    result = await sendOtp(parsed.data.phone);
  } catch (error) {
    console.error("[api/otp/send] error tak terduga", error);
    return serverError();
  }

  if (!result.ok) {
    if (result.reason === "RATE_LIMITED") {
      return apiError(
        "RATE_LIMITED",
        "Terlalu banyak percobaan, tunggu 1 jam",
        429,
      );
    }
    return apiError("SEND_FAILED", "Gagal kirim OTP, coba lagi", 502);
  }

  return apiSuccess({ message: "OTP terkirim" });
}
