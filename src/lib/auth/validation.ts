import { z } from "zod";

// Normalisasi nomor HP Indonesia ke format +62.
// Menerima "08123456789", "628123456789", "+628123456789", "0812-3456-789".
export function normalizePhone(input: string): string {
  const digits = input.replace(/[^\d+]/g, "");

  if (digits.startsWith("+62")) return digits;
  if (digits.startsWith("62")) return `+${digits}`;
  if (digits.startsWith("0")) return `+62${digits.slice(1)}`;
  if (digits.startsWith("+")) return digits;

  return `+62${digits}`;
}

export const phoneSchema = z
  .string({
    required_error: "Nomor HP wajib diisi",
    invalid_type_error: "Nomor HP tidak valid",
  })
  .trim()
  .transform(normalizePhone)
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

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Nama wajib diisi", invalid_type_error: "Nama wajib diisi" })
    .trim()
    .min(1, "Nama wajib diisi")
    .max(100, "Nama maksimal 100 karakter"),
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

export const loginSchema = z.object({
  identifier: z
    .string({
      required_error: "Email atau nomor HP wajib diisi",
      invalid_type_error: "Email atau nomor HP wajib diisi",
    })
    .trim()
    .min(1, "Email atau nomor HP wajib diisi")
    .max(255),
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
