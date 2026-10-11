import { z } from "zod";

// Normalisasi nomor HP:
// - Format lokal Indonesia diterima apa adanya dan dinormalkan ke +62
//   ("08123456789", "628123456789", "0812-3456-789") — pasar utama tetap
//   Indonesia, jadi menulis tanpa + tetap nyaman.
// - Nomor internasional (E.164) BELUM diterima: fokus pasar masih Indonesia.
//   PRD 7.8 mencantumkan Future: International payment expansion — saat jangkauan
//   internasional diaktifkan (shipping = RajaOngkir international-destination /
//   international-cost, kurir JNE/TIKI/POS; payment kartu luar negeri), hanya
//   refine di bawah yang dibuka ke /^\+\d{8,15}$/ (E.164) — normalisasi di atas
//   sudah melewatkan "+..." apa adanya, dan seluruh konsumen phoneSchema ikut.
export function normalizePhone(input: string): string {
  const digits = input.replace(/[^\d+]/g, "");

  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("62")) return `+${digits}`;
  if (digits.startsWith("0")) return `+62${digits.slice(1)}`;

  return `+62${digits}`;
}

export const phoneSchema = z
  .string({
    required_error: "Nomor HP wajib diisi",
    invalid_type_error: "Nomor HP tidak valid",
  })
  .trim()
  .transform(normalizePhone)
  // Refine tetap Indonesia (+62 + 8-11 angka): fokus pasar masih Indonesia
  // (PRD 7.8). Rencana internasional dicatat di komentar normalizePhone.
  .refine((value) => /^\+62\d{8,11}$/.test(value), {
    message: "Nomor HP tidak valid",
  });

export const otpCodeSchema = z
  .string({
    required_error: "Kode OTP wajib diisi",
    invalid_type_error: "Kode OTP tidak valid",
  })
  .trim()
  .regex(/^\d{6}$/, "Kode OTP tidak valid");

// Nama orang dipakai registrasi (AUTH-02) dan ubah profil (CUST-03): maksimal
// huruf (termasuk berdiakritik), spasi, dan koneksi umum (koma titik strip
// apostrof). Angka gk wajar untuk nama lengkap ("12345", "0812xxxx") — ditolak,
// bukan hanya di-minim-kan.
export const personNameSchema = z
  .string({ required_error: "Nama wajib diisi", invalid_type_error: "Nama wajib diisi" })
  .trim()
  .min(1, "Nama wajib diisi")
  .max(100, "Nama maksimal 100 karakter")
  .regex(/^[A-Za-z\u00C0-\u024F' .-]+$/, "Nama hanya boleh berisi huruf")
  .regex(/[A-Za-z\u00C0-\u024F]/, "Nama harus mengandung huruf");

export const registerSchema = z.object({
  name: personNameSchema,
  email: z
    .string({
      required_error: "Email wajib diisi",
      invalid_type_error: "Email tidak valid",
    })
    .trim()
    .toLowerCase()
    .email("Email tidak valid")
    .max(255, "Email maksimal 255 karakter"),
  phone: z
    .union([phoneSchema, z.literal("")])
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
  password: z
    .string({
      required_error: "Password wajib diisi",
      invalid_type_error: "Password wajib diisi",
    })
    .min(8, "Password minimal 8 karakter")
    .max(72, "Password maksimal 72 karakter"),
});

// Identifier login: email ATAU nomor HP. Bentuknya ditentukan lewat "@", lalu
// masing-masing divalidasi dan dinormalisasi (email lowercase; HP memakai
// normalizePhone, karena akun menyimpan nomor dalam format +62 hasil OTP).
// Identifier yang bukan keduanya ditolak dengan pesan yang sama generik.
export const loginSchema = z.object({
  identifier: z
    .string({
      required_error: "Email atau nomor HP wajib diisi",
      invalid_type_error: "Email atau nomor HP wajib diisi",
    })
    .trim()
    .min(1, "Email atau nomor HP wajib diisi")
    .max(255)
    .transform((value) => {
      if (value.includes("@")) {
        return { kind: "email" as const, value: value.toLowerCase() };
      }
      const phone = phoneSchema.safeParse(value);
      if (phone.success) {
        return { kind: "phone" as const, value: phone.data };
      }
      return { kind: "invalid" as const, value };
    })
    .refine((parsed) => parsed.kind !== "invalid", {
      message: "Format email atau nomor HP tidak valid",
    }),
  password: z
    .string({
      required_error: "Password wajib diisi",
      invalid_type_error: "Password wajib diisi",
    })
    .min(1, "Password wajib diisi"),
});

export const sendOtpSchema = z.object({
  phone: phoneSchema,
});

export const verifyOtpSchema = z.object({
  phone: phoneSchema,
  code: otpCodeSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

// PH-07 (AUTH-04/AUTH-05): password baru untuk set password (guest yang mengisi
// email saat checkout) dan reset password (lupa password). Aturan panjang sama
// dengan registrasi.
export const newPasswordSchema = z
  .string({
    required_error: "Password wajib diisi",
    invalid_type_error: "Password wajib diisi",
  })
  .min(8, "Password minimal 8 karakter")
  .max(72, "Password maksimal 72 karakter");

export const setPasswordSchema = z.object({
  token: z.string().trim().min(1, "Token tidak valid").max(256),
  password: newPasswordSchema,
});

export const forgotPasswordSchema = z.object({
  email: z
    .string({
      required_error: "Email wajib diisi",
      invalid_type_error: "Email tidak valid",
    })
    .trim()
    .toLowerCase()
    .email("Email tidak valid")
    .max(255, "Email maksimal 255 karakter"),
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1, "Token tidak valid").max(256),
  password: newPasswordSchema,
});

// CUST-03 (PH-10): tautan verifikasi email baru. Token sekali pakai dari Redis
// (pola set/reset password), dibawa lewat query ke halaman /verify-email.
export const verifyEmailSchema = z.object({
  token: z.string().trim().min(1, "Token tidak valid").max(256),
});

export type SetPasswordInput = z.infer<typeof setPasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
