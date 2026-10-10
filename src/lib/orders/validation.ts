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
  street: z
    .string({
      required_error: "Alamat wajib diisi",
      invalid_type_error: "Alamat tidak valid",
    })
    .trim()
    .min(1, "Alamat wajib diisi")
    .max(255, "Alamat maksimal 255 karakter"),
  city: z
    .string({
      required_error: "Kota wajib diisi",
      invalid_type_error: "Kota tidak valid",
    })
    .trim()
    .min(1, "Kota wajib diisi")
    .max(100, "Kota maksimal 100 karakter"),
  province: z
    .string({
      required_error: "Provinsi wajib diisi",
      invalid_type_error: "Provinsi tidak valid",
    })
    .trim()
    .min(1, "Provinsi wajib diisi")
    .max(100, "Provinsi maksimal 100 karakter"),
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
    .string({
      required_error: "Kode pos wajib diisi",
      invalid_type_error: "Kode pos tidak valid",
    })
    .trim()
    .regex(/^\d{3,10}$/, "Kode pos tidak valid"),
  note: z
    .string({ invalid_type_error: "Catatan tidak valid" })
    .trim()
    .max(255, "Catatan maksimal 255 karakter")
    .optional(),
});

// Biaya ongkir TIDAK diterima dari klien. Klien hanya mengirim pilihan kurir
// (kode + layanan) dan server menghitung ulang biayanya (AC-ORDER-01-08).
export const orderCreateSchema = z.object({
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
    .string({
      required_error: "Kurir wajib dipilih",
      invalid_type_error: "Kurir tidak valid",
    })
    .trim()
    .min(1, "Kurir wajib dipilih")
    .max(50, "Kurir tidak valid"),
  service: z
    .string({
      required_error: "Layanan wajib dipilih",
      invalid_type_error: "Layanan tidak valid",
    })
    .trim()
    .min(1, "Layanan wajib dipilih")
    .max(100, "Layanan tidak valid"),
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
