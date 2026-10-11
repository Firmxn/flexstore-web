import { findUserByEmail } from "@/lib/auth/queries";
import { isForgotPasswordRateLimited } from "@/lib/auth/tokens";
import { forgotPasswordSchema } from "@/lib/auth/validation";
import { sendPasswordResetEmail } from "@/lib/notifications";
import { apiSuccess, validationError } from "@/lib/utils/api";

// AUTH-05 (PH-07, PRD 4.1): minta tautan reset password. Selalu dijawab sukses
// supaya keberadaan email tidak bocor (OWASP A07 user enumeration); email hanya
// dikirim bila akun ada dan punya password.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const email = parsed.data.email;

  try {
    const limited = await isForgotPasswordRateLimited(email);
    if (!limited) {
      const user = await findUserByEmail(email);
      if (user?.password && user.role === "CUSTOMER") {
        await sendPasswordResetEmail(email, user.id);
      }
    }
  } catch (error) {
    console.error("[api/auth/forgot-password] error tak terduga", error);
  }

  return apiSuccess({ ok: true });
}
