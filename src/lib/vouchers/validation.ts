import { z } from "zod";
import { phoneSchema } from "@/lib/auth/validation";

export const VOUCHER_TYPES = ["PERCENTAGE", "NOMINAL", "SHIPPING"] as const;

export const VOUCHER_TYPE_LABELS: Record<(typeof VOUCHER_TYPES)[number], string> = {
  PERCENTAGE: "Persentase",
  NOMINAL: "Nominal",
  SHIPPING: "Ongkir",
};

const moneySchema = z
  .number({ invalid_type_error: "Nilai tidak valid" })
  .min(0, "Nilai tidak boleh negatif")
  .max(1_000_000_000, "Nilai terlalu besar");

const optionalIntSchema = z
  .union([
    z
      .number({ invalid_type_error: "Angka tidak valid" })
      .int("Harus bilangan bulat")
      .min(0, "Tidak boleh negatif")
      .max(1_000_000, "Nilai terlalu besar"),
    z.null(),
  ])
  .optional()
  .transform((value) => (value === null ? undefined : value));

export const voucherSchema = z
  .object({
    code: z
      .string({
        required_error: "Kode voucher wajib diisi",
        invalid_type_error: "Kode voucher tidak valid",
      })
      .trim()
      .toUpperCase()
      .min(3, "Kode minimal 3 karakter")
      .max(30, "Kode maksimal 30 karakter")
      .regex(/^[A-Z0-9_-]+$/, "Kode hanya boleh huruf, angka, minus, dan garis bawah"),
    type: z.enum(VOUCHER_TYPES, {
      required_error: "Jenis voucher wajib dipilih",
      invalid_type_error: "Jenis voucher tidak valid",
    }),
    discountPercentage: moneySchema
      .max(100, "Persentase maksimal 100")
      .optional(),
    discountAmount: moneySchema.optional(),
    maxDiscount: moneySchema.optional(),
    minTransaction: moneySchema.default(0),
    usageLimit: optionalIntSchema,
    usageLimitPerPhone: optionalIntSchema,
    validFrom: z.coerce.date({
      required_error: "Tanggal mulai wajib diisi",
      invalid_type_error: "Tanggal mulai tidak valid",
    }),
    validUntil: z.coerce.date({
      required_error: "Tanggal akhir wajib diisi",
      invalid_type_error: "Tanggal akhir tidak valid",
    }),
    isActive: z.boolean({ invalid_type_error: "Status tidak valid" }).default(true),
    compatibleVoucherIds: z
      .array(z.string().uuid("Voucher tidak valid"))
      .max(50)
      .optional()
      .default([]),
  })
  .superRefine((value, ctx) => {
    if (value.type === "PERCENTAGE" && value.discountPercentage == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Persentase wajib diisi",
        path: ["discountPercentage"],
      });
    }
    if (value.type !== "PERCENTAGE" && value.discountAmount == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Nominal wajib diisi",
        path: ["discountAmount"],
      });
    }
    if (value.validUntil <= value.validFrom) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Tanggal akhir harus setelah tanggal mulai",
        path: ["validUntil"],
      });
    }
  });

export const voucherListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().max(200).optional(),
});

// Pratinjau voucher di checkout. Subtotal dihitung server dari keranjang
// (variantIds); `shippingCost` hanya untuk pratinjau voucher ongkir karena
// perhitungan final dilakukan ulang saat pesanan dibuat.
export const voucherValidateSchema = z.object({
  codes: z
    .array(
      z
        .string({ invalid_type_error: "Kode voucher tidak valid" })
        .trim()
        .min(1, "Kode voucher wajib diisi")
        .max(30, "Kode voucher tidak valid"),
    )
    .max(2, "Maksimal 2 voucher per transaksi")
    .default([]),
  variantIds: z
    .array(z.string().uuid("Varian tidak valid"), {
      invalid_type_error: "Pilihan produk tidak valid",
    })
    .min(1, "Pilih minimal satu produk")
    .max(50, "Terlalu banyak produk dipilih"),
  shippingCost: moneySchema.default(0),
  phone: phoneSchema.optional(),
});

export type VoucherInput = z.infer<typeof voucherSchema>;
export type VoucherValidateInput = z.infer<typeof voucherValidateSchema>;
