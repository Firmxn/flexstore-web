import { z } from "zod";
import {
  normalizePhone,
  personNameSchema,
  phoneSchema,
} from "@/lib/utils/validation";

// Aturan nomor HP dan nama orang tinggal di src/lib/utils/validation.ts karena
// dipakai lintas domain (auth, alamat, checkout, voucher). Re-export di sini
// supaya pemanggil lama (mis. src/lib/orders) tidak perlu berubah.
export { normalizePhone, personNameSchema, phoneSchema };

export const otpCodeSchema = z
  .string({
    required_error: "Kode OTP wajib diisi",
    invalid_type_error: "Kode OTP tidak valid",
  })
  .trim()
  .regex(/^\d{6}$/, "Kode OTP tidak valid");

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
