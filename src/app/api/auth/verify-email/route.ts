import { consumeEmailChangeToken } from "@/lib/auth/tokens";
import { verifyEmailSchema } from "@/lib/auth/validation";
import { findUserIdByEmail, updateAccountEmail } from "@/lib/customers";
import {
  apiError,
  apiSuccess,
  validationError,
  withRouteErrors,
} from "@/lib/utils/api";

// CUST-03 (PH-10): menyelesaikan verifikasi email baru. Boleh dibuka tanpa sesi
// karena otorisasinya memakai token sekali pakai dari Redis (docs/03 CUST-03
// bagian 3). Email hanya berubah di sini, bukan saat pengajuan di /profile.

export async function POST(request: Request) {
  return withRouteErrors(async () => {
    const body = await request.json().catch(() => null);
    const parsed = verifyEmailSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const payload = await consumeEmailChangeToken(parsed.data.token);
    if (!payload) {
      return apiError(
        "TOKEN_INVALID",
        "Tautan verifikasi tidak valid atau sudah kedaluwarsa",
        400,
      );
    }

    // Bisa bentrok bila email baru diklaim akun lain setelah pengajuan.
    const owner = await findUserIdByEmail(payload.newEmail);
    if (owner && owner.id !== payload.userId) {
      return apiError("EMAIL_IN_USE", "Email sudah digunakan", 409);
    }

    await updateAccountEmail(payload.userId, payload.newEmail);
    return apiSuccess({ ok: true, email: payload.newEmail });
  });
}
