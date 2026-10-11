import { z } from "zod";

// SITE-01..SITE-04 (PH-08). Semua input divalidasi di server sebelum menyentuh
// Prisma (OWASP A03). Rahasia (kunci Xendit/RajaOngkir) tidak pernah masuk ke
// sini karena tetap berada di env.

const optionalText = (max: number, label: string) =>
  z
    .string({ invalid_type_error: `${label} tidak valid` })
    .trim()
    .max(max, `${label} maksimal ${max} karakter`)
    .optional()
    .transform((value) => (value ? value : undefined));

export const platformSettingsSchema = z.object({
  maintenanceMode: z.boolean({
    invalid_type_error: "Status pemeliharaan tidak valid",
  }),
  maintenanceMessage: optionalText(300, "Pesan pemeliharaan"),
  registrationEnabled: z.boolean({
    invalid_type_error: "Status pendaftaran tidak valid",
  }),
});

export const paymentSettingsSchema = z.object({
  paymentEnabled: z.boolean({
    invalid_type_error: "Status pembayaran tidak valid",
  }),
  paymentMode: z.enum(["SANDBOX", "PRODUCTION"], {
    invalid_type_error: "Mode pembayaran tidak valid",
  }),
  invoiceDurationSeconds: z.coerce
    .number({ invalid_type_error: "Durasi invoice tidak valid" })
    .int("Durasi invoice harus bilangan bulat")
    .min(60, "Durasi invoice minimal 60 detik")
    .max(86400, "Durasi invoice maksimal 86400 detik"),
});

export const shippingSettingsSchema = z.object({
  shippingEnabled: z.boolean({
    invalid_type_error: "Status ongkir tidak valid",
  }),
  originDistrictId: optionalText(64, "ID asal ongkir"),
  couriers: z
    .string({
      required_error: "Daftar kurir wajib diisi",
      invalid_type_error: "Daftar kurir tidak valid",
    })
    .trim()
    .min(1, "Daftar kurir wajib diisi")
    .max(200, "Daftar kurir maksimal 200 karakter")
    .regex(
      /^[a-z0-9]+(?::[a-z0-9]+)*$/i,
      "Daftar kurir tidak valid (contoh: jne:sicepat:jnt)",
    ),
  weightPerItemGram: z.coerce
    .number({ invalid_type_error: "Berat per item tidak valid" })
    .int("Berat per item harus bilangan bulat")
    .min(1, "Berat per item minimal 1 gram")
    .max(50_000, "Berat per item maksimal 50000 gram"),
  flatRateIdr: z.coerce
    .number({ invalid_type_error: "Tarif flat tidak valid" })
    .int("Tarif flat harus bilangan bulat")
    .min(0, "Tarif flat tidak boleh negatif")
    .max(1_000_000, "Tarif flat maksimal 1000000"),
});

export const createStoreAdminSchema = z.object({
  name: z
    .string({
      required_error: "Nama wajib diisi",
      invalid_type_error: "Nama tidak valid",
    })
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
    .max(200, "Email maksimal 200 karakter"),
  password: z
    .string({
      required_error: "Password wajib diisi",
      invalid_type_error: "Password tidak valid",
    })
    .min(8, "Password minimal 8 karakter")
    .max(72, "Password maksimal 72 karakter"),
});

// PATCH menerima sebagian field; minimal satu harus ada supaya permintaan
// kosong tidak diam-diam dianggap sukses.
export const updateStoreAdminSchema = z
  .object({
    active: z
      .boolean({ invalid_type_error: "Status akun tidak valid" })
      .optional(),
    password: z
      .string({ invalid_type_error: "Password tidak valid" })
      .min(8, "Password minimal 8 karakter")
      .max(72, "Password maksimal 72 karakter")
      .optional(),
  })
  .refine(
    (value) => value.active !== undefined || value.password !== undefined,
    { message: "Tidak ada perubahan" },
  );

export type PlatformSettingsInput = z.infer<typeof platformSettingsSchema>;
export type PaymentSettingsInput = z.infer<typeof paymentSettingsSchema>;
export type ShippingSettingsInput = z.infer<typeof shippingSettingsSchema>;
export type CreateStoreAdminInput = z.infer<typeof createStoreAdminSchema>;
export type UpdateStoreAdminInput = z.infer<typeof updateStoreAdminSchema>;
