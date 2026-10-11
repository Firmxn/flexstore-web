import { z } from "zod";
import { phoneSchema } from "@/lib/auth/validation";
import { ORDER_NUMBER_PATTERN } from "./number";

// Alamat pengiriman disimpan sebagai JSON di Order (SDD 6.2). MOD-CUST (alamat
// tersimpan) belum punya fase, jadi alamat diisi per pesanan.
export const shippingAddressSchema = z.object({
  name: z
    .string({
      required_error: "Nama penerima wajib diisi",
      invalid_type_error: "Nama penerima tidak valid",
    })
    .trim()
    .min(1, "Nama penerima wajib diisi")
    .max(100, "Nama maksimal 100 karakter"),
  phone: phoneSchema,
  // Field wilayah wajib untuk pengiriman (DELIVERY); untuk PICKUP hanya
  // nama + nomor HP yang dipakai. Kewajibannya ditegakkan di superRefine
  // `orderCreateSchema` supaya pesan error tetap tepat per metode.
  street: z
    .string({ invalid_type_error: "Alamat tidak valid" })
    .trim()
    .max(255, "Alamat maksimal 255 karakter")
    .optional(),
  city: z
    .string({ invalid_type_error: "Kota tidak valid" })
    .trim()
    .max(100, "Kota maksimal 100 karakter")
    .optional(),
  province: z
    .string({ invalid_type_error: "Provinsi tidak valid" })
    .trim()
    .max(100, "Provinsi maksimal 100 karakter")
    .optional(),
  district: z
    .string({ invalid_type_error: "Kecamatan tidak valid" })
    .trim()
    .max(100, "Kecamatan maksimal 100 karakter")
    .optional(),
  subdistrict: z
    .string({ invalid_type_error: "Kelurahan tidak valid" })
    .trim()
    .max(100, "Kelurahan maksimal 100 karakter")
    .optional(),
  postalCode: z
    .string({ invalid_type_error: "Kode pos tidak valid" })
    .trim()
    .max(20, "Kode pos maksimal 20 karakter")
    .optional(),
  note: z
    .string({ invalid_type_error: "Catatan tidak valid" })
    .trim()
    .max(255, "Catatan maksimal 255 karakter")
    .optional(),
});

export const FULFILLMENT_METHODS = ["DELIVERY", "PICKUP"] as const;

// Biaya ongkir TIDAK diterima dari klien. Klien hanya mengirim pilihan kurir
// (kode + layanan) dan server menghitung ulang biayanya (AC-ORDER-01-08).
// Untuk PICKUP, kurir/tujuan tidak dipakai dan ongkir menjadi 0 (PRD 3.1.F).
export const orderCreateSchema = z
  .object({
    fulfillment: z
      .enum(FULFILLMENT_METHODS, {
        invalid_type_error: "Metode pemenuhan tidak valid",
      })
      .default("DELIVERY"),
    variantIds: z
      .array(z.string().uuid("Varian tidak valid"), {
        required_error: "Pilih minimal satu produk",
        invalid_type_error: "Pilihan produk tidak valid",
      })
      .min(1, "Pilih minimal satu produk")
      .max(50, "Terlalu banyak produk dipilih"),
    destinationId: z
      .string({ invalid_type_error: "Tujuan tidak valid" })
      .trim()
      .regex(/^\d{1,10}$/, "Tujuan tidak valid")
      .optional(),
    courierCode: z
      .string({ invalid_type_error: "Kurir tidak valid" })
      .trim()
      .max(50, "Kurir tidak valid")
      .optional(),
    service: z
      .string({ invalid_type_error: "Layanan tidak valid" })
      .trim()
      .max(100, "Layanan tidak valid")
      .optional(),
    address: shippingAddressSchema,
    // Maksimal 2 voucher (PRD 7.5). Potongan dihitung ulang di server; klien
    // hanya mengirim kode.
    voucherCodes: z
      .array(
        z
          .string({ invalid_type_error: "Kode voucher tidak valid" })
          .trim()
          .min(1, "Kode voucher wajib diisi")
          .max(30, "Kode voucher tidak valid"),
      )
      .max(2, "Maksimal 2 voucher per transaksi")
      .optional()
      .default([]),
    guestPhone: phoneSchema.optional(),
    guestEmail: z
      .union([
        z
          .string({ invalid_type_error: "Email tidak valid" })
          .trim()
          .toLowerCase()
          .email("Email tidak valid")
          .max(255, "Email maksimal 255 karakter"),
        z.literal(""),
      ])
      .optional()
      .transform((value) => (value ? value : undefined)),
  })
  .superRefine((value, ctx) => {
    // Pickup tidak butuh kurir maupun alamat lengkap (SHIP-03).
    if (value.fulfillment !== "DELIVERY") return;

    const required = (
      condition: boolean,
      message: string,
      path: (string | number)[],
    ) => {
      if (!condition) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message, path });
      }
    };

    required(Boolean(value.courierCode), "Kurir wajib dipilih", ["courierCode"]);
    required(Boolean(value.service), "Layanan wajib dipilih", ["service"]);
    required(
      Boolean(value.address.street),
      "Alamat wajib diisi",
      ["address", "street"],
    );
    required(Boolean(value.address.city), "Kota wajib diisi", ["address", "city"]);
    required(
      Boolean(value.address.province),
      "Provinsi wajib diisi",
      ["address", "province"],
    );
    required(
      Boolean(value.address.postalCode),
      "Kode pos wajib diisi",
      ["address", "postalCode"],
    );
  });

export const trackOrderSchema = z.object({
  orderNumber: z
    .string({
      required_error: "Nomor pesanan wajib diisi",
      invalid_type_error: "Nomor pesanan tidak valid",
    })
    .trim()
    .toUpperCase()
    .regex(ORDER_NUMBER_PATTERN, "Nomor pesanan tidak valid"),
  phone: phoneSchema,
});

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type OrderCreateInput = z.infer<typeof orderCreateSchema>;
export type TrackOrderInput = z.infer<typeof trackOrderSchema>;
