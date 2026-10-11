import { requireCustomer } from "@/lib/auth/guard";
import { sendEmailChangeVerification } from "@/lib/notifications";
import {
  findUserIdByEmail,
  getAccountProfile,
  profileUpdateSchema,
  updateAccountName,
  updateAccountPassword,
} from "@/lib/customers";
import {
  apiError,
  apiSuccess,
  forbidden,
  validationError,
  withRouteErrors,
} from "@/lib/utils/api";
import { isEmailChangeRateLimited } from "@/lib/auth/tokens";

// CUST-03 (PH-10): ubah data akun customer (nama, email, password). Hanya
// customer; role lain ditolak (OWASP A01). Perubahan email TIDAK langsung
// tersimpan — tautan verifikasi dikirim ke email baru dan `User.email` baru
// berubah setelah tautan dibuka lewat /api/auth/verify-email.

export async function PATCH(request: Request) {
  return withRouteErrors(async () => {
    const guard = await requireCustomer();
    if (!guard.ok) return guard.response;
    if (guard.user.role !== "CUSTOMER") return forbidden();

    const body = await request.json().catch(() => null);
    const parsed = profileUpdateSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const current = await getAccountProfile(guard.user.id);
    if (!current) return apiError("UNAUTHORIZED", "Sesi tidak valid", 401);

    const { name, email, currentPassword, newPassword } = parsed.data;
    const emailChange = Boolean(email) && email !== current.email;

    // Semua pemeriksaan dijalankan sebelum mutasi supaya permintaan yang gagal
    // tidak menyisakan perubahan sebagian.
    if (emailChange && email) {
      const owner = await findUserIdByEmail(email);
      if (owner && owner.id !== guard.user.id) {
        return apiError("EMAIL_IN_USE", "Email sudah digunakan", 409);
      }
      if (await isEmailChangeRateLimited(guard.user.id)) {
        return apiError(
          "RATE_LIMITED",
          "Terlalu banyak permintaan, coba lagi nanti",
          429,
        );
      }
    }

    if (newPassword && currentPassword) {
      const result = await updateAccountPassword(
        guard.user.id,
        currentPassword,
        newPassword,
      );
      if (!result.ok) {
        return apiError("INVALID_PASSWORD", "Password saat ini salah", 400);
      }
    }

    if (name) {
      await updateAccountName(guard.user.id, name);
    }

    let emailVerificationSent = false;
    if (emailChange && email) {
      await sendEmailChangeVerification(guard.user.id, email);
      emailVerificationSent = true;
    }

    const profile = await getAccountProfile(guard.user.id);

    return apiSuccess({
      profile: profile ?? current,
      emailVerificationSent,
      ...(emailVerificationSent && email ? { pendingEmail: email } : {}),
    });
  });
}
