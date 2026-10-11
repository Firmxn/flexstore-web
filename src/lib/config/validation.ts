import { z } from "zod";
import {
  CONTACT_PHONE_REGEX,
  SOCIAL_HANDLE_REGEX,
  isControlCharFree,
} from "@/lib/utils/validation";

// CONFIG-01 (PH-06): pengaturan toko + template alasan penolakan pembatalan.
// Semua input divalidasi di server sebelum menyentuh Prisma (OWASP A03).

const optionalText = (max: number, label: string) =>
  z
    .string({ invalid_type_error: `${label} tidak valid` })
    .trim()
    .max(max, `${label} maksimal ${max} karakter`)
    .refine(isControlCharFree, `${label} memuat karakter yang tidak diizinkan`)
    .optional()
    .transform((value) => (value ? value : undefined));

// Akun media sosial: handle ("@toko.id") atau URL profil.
function socialHandleSchema() {
  return z
    .union([
      z.literal(""),
      z
        .string({ invalid_type_error: "Akun media sosial tidak valid" })
        .trim()
        .max(200, "Akun media sosial maksimal 200 karakter")
        .regex(SOCIAL_HANDLE_REGEX, "Akun media sosial hanya boleh berisi huruf, angka, dan tanda @ . _ - / :")
        .regex(/[A-Za-z0-9]/, "Akun media sosial harus mengandung huruf atau angka"),
    ])
    .optional()
    .transform((value) => (value ? value : undefined));
}

export const storeSettingsSchema = z.object({
  storeEmail: z
    .union([z.string().trim().email("Email toko tidak valid").max(200), z.literal("")])
    .optional()
    .transform((value) => (value ? value : undefined)),
  // Telepon toko bisa nomor rumah/kantor maupun HP: angka + pemisah saja,
  // minimal 7 angka supaya "021-1234567" lolos dan "abc" ditolak.
  storePhone: z
    .union([
      z.literal(""),
      z
        .string({ invalid_type_error: "Nomor telepon tidak valid" })
        .trim()
        .max(30, "Nomor telepon maksimal 30 karakter")
        .regex(CONTACT_PHONE_REGEX, "Nomor telepon hanya boleh berisi angka")
        .regex(/(?:\d[\s().-]*){7,}/, "Nomor telepon minimal 7 angka"),
    ])
    .optional()
    .transform((value) => (value ? value : undefined)),
  storeAddress: optionalText(300, "Alamat toko"),
  aboutUs: optionalText(2000, "Tentang toko"),
  returnPolicy: optionalText(2000, "Kebijakan pengembalian"),
  warrantyPolicy: optionalText(2000, "Kebijakan garansi"),
  // Pickup (SHIP-03) hanya muncul di checkout bila diaktifkan.
  pickupEnabled: z
    .boolean({ invalid_type_error: "Status pickup tidak valid" })
    .default(false),
  pickupInfo: optionalText(1000, "Informasi pickup"),
  // Akun media sosial: handle ("@toko.id") atau URL profil.
  socialInstagram: socialHandleSchema(),
  socialFacebook: socialHandleSchema(),
  socialWhatsapp: socialHandleSchema(),
});

export const cancellationReasonSchema = z.object({
  text: z
    .string({
      required_error: "Alasan wajib diisi",
      invalid_type_error: "Alasan tidak valid",
    })
    .trim()
    .min(3, "Alasan minimal 3 karakter")
    .max(300, "Alasan maksimal 300 karakter")
    .regex(/[A-Za-z0-9]/, "Alasan harus mengandung huruf atau angka")
    .refine(isControlCharFree, "Alasan memuat karakter yang tidak diizinkan"),
  isActive: z.boolean({ invalid_type_error: "Status tidak valid" }).default(true),
  sortOrder: z.coerce
    .number({ invalid_type_error: "Urutan tidak valid" })
    .int("Urutan harus bilangan bulat")
    .min(0, "Urutan tidak boleh negatif")
    .max(999, "Urutan terlalu besar")
    .default(0),
});

export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;
export type CancellationReasonInput = z.infer<typeof cancellationReasonSchema>;
