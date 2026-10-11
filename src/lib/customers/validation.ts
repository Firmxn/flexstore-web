import { z } from "zod";
import { newPasswordSchema, personNameSchema, phoneSchema } from "@/lib/auth/validation";

// CUST-01 (PRD 5.8 butir 1): maksimal 5 alamat tersimpan per customer. Batas
// ditegakkan di server (mutasi), bukan hanya di UI.
export const MAX_ADDRESSES = 5;

// Teks opsional: string kosong dari form dianggap tidak diisi.
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Maksimal ${max} karakter`)
    .optional()
    .transform((value) => (value ? value : undefined));

const requiredText = (label: string, max: number) =>
  z
    .string({ required_error: `${label} wajib diisi`, invalid_type_error: `${label} wajib diisi` })
    .trim()
    .min(1, `${label} wajib diisi`)
    .max(max, `${label} maksimal ${max} karakter`);

export const addressInputSchema = z.object({
  label: requiredText("Label alamat", 50),
  recipientName: requiredText("Nama penerima", 100),
  phone: phoneSchema,
  // Titik tujuan RajaOngkir (id kota/kecamatan). Wajib untuk menghitung ongkir;
  // disimpan sebagai string supaya tetap fleksibel antar provider.
  destinationId: optionalText(64),
  province: requiredText("Provinsi", 100),
  city: requiredText("Kota/Kabupaten", 100),
  district: optionalText(100),
  subdistrict: optionalText(100),
  postalCode: optionalText(10),
  street: requiredText("Alamat lengkap", 500),
  note: optionalText(500),
  isPrimary: z.boolean().optional().default(false),
});

// PATCH menerima sebagian field (mis. hanya menandai alamat utama). Minimal satu
// field harus ada supaya body kosong tidak lolos diam-diam.
export const addressUpdateSchema = addressInputSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Tidak ada perubahan",
  });

export const notificationPreferenceSchema = z.object({
  orderConfirmation: z.boolean(),
  paymentConfirmation: z.boolean(),
  shippingUpdate: z.boolean(),
  cancellationUpdate: z.boolean(),
  refundUpdate: z.boolean(),
});

export type AddressInput = z.infer<typeof addressInputSchema>;
export type AddressUpdateInput = z.infer<typeof addressUpdateSchema>;
export type NotificationPreferenceInput = z.infer<
  typeof notificationPreferenceSchema
>;

// CUST-03 (PH-10): skema PATCH /api/customer/profile. Semua field opsional
// (klien mengirim hanya yang berubah); minimal satu field supaya body kosong
// tidak lolos. Ganti email memakai aturan email registrasi, dan ganti password
// wajib menyertakan password saat ini (aturan panjang mengikuti AUTH-02/AUTH-05).
export const profileUpdateSchema = z
  .object({
    name: personNameSchema.optional(),
    email: z
      .string({ invalid_type_error: "Email tidak valid" })
      .trim()
      .toLowerCase()
      .email("Email tidak valid")
      .max(255, "Email maksimal 255 karakter")
      .optional(),
    currentPassword: z.string().optional(),
    newPassword: newPasswordSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "Tidak ada perubahan",
  })
  .refine((value) => !value.newPassword || Boolean(value.currentPassword), {
    message: "Password saat ini wajib diisi",
    path: ["currentPassword"],
  });

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
