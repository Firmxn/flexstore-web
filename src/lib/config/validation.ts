import { z } from "zod";

// CONFIG-01 (PH-06): pengaturan toko + template alasan penolakan pembatalan.
// Semua input divalidasi di server sebelum menyentuh Prisma (OWASP A03).

const optionalText = (max: number, label: string) =>
  z
    .string({ invalid_type_error: `${label} tidak valid` })
    .trim()
    .max(max, `${label} maksimal ${max} karakter`)
    .optional()
    .transform((value) => (value ? value : undefined));

export const storeSettingsSchema = z.object({
  storeName: z
    .string({
      required_error: "Nama toko wajib diisi",
      invalid_type_error: "Nama toko tidak valid",
    })
    .trim()
    .min(1, "Nama toko wajib diisi")
    .max(100, "Nama toko maksimal 100 karakter"),
  storeEmail: z
    .union([z.string().trim().email("Email toko tidak valid").max(200), z.literal("")])
    .optional()
    .transform((value) => (value ? value : undefined)),
  storePhone: optionalText(30, "Nomor telepon"),
  storeAddress: optionalText(300, "Alamat toko"),
  aboutUs: optionalText(2000, "Tentang toko"),
  returnPolicy: optionalText(2000, "Kebijakan pengembalian"),
  warrantyPolicy: optionalText(2000, "Kebijakan garansi"),
  // Pickup (SHIP-03) hanya muncul di checkout bila diaktifkan.
  pickupEnabled: z
    .boolean({ invalid_type_error: "Status pickup tidak valid" })
    .default(false),
  pickupInfo: optionalText(1000, "Informasi pickup"),
  socialInstagram: optionalText(200, "Instagram"),
  socialFacebook: optionalText(200, "Facebook"),
  socialWhatsapp: optionalText(200, "WhatsApp"),
});

export const cancellationReasonSchema = z.object({
  text: z
    .string({
      required_error: "Alasan wajib diisi",
      invalid_type_error: "Alasan tidak valid",
    })
    .trim()
    .min(3, "Alasan minimal 3 karakter")
    .max(300, "Alasan maksimal 300 karakter"),
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
