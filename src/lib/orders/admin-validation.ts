import { z } from "zod";

// Validasi aksi admin atas pesanan (ORDER-05/06/07, PH-06). Semua input
// divalidasi di server sebelum menyentuh Prisma (OWASP A03).

export const ORDER_STATUS_FILTERS = [
  "WAITING_PAYMENT",
  "PROCESSING",
  "SHIPPED",
  "COMPLETED",
  "CANCEL_REQUESTED",
  "CANCELED",
] as const;

export const adminOrderListQuerySchema = z.object({
  status: z.enum(ORDER_STATUS_FILTERS).optional(),
  search: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const trackingNumberSchema = z
  .string({
    required_error: "Nomor resi wajib diisi",
    invalid_type_error: "Nomor resi tidak valid",
  })
  .trim()
  .min(3, "Nomor resi minimal 3 karakter")
  .max(50, "Nomor resi maksimal 50 karakter")
  .regex(/^[A-Za-z0-9-]+$/, "Nomor resi hanya boleh huruf, angka, dan minus");

// Satu endpoint untuk semua aksi admin atas pesanan; tiap aksi membawa hanya
// field yang relevan (discriminated union) supaya validasi tetap ketat.
export const adminOrderActionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("SHIP"), trackingNumber: trackingNumberSchema }),
  z.object({ action: z.literal("COMPLETE") }),
  z.object({ action: z.literal("APPROVE_CANCEL") }),
  z.object({
    action: z.literal("REJECT_CANCEL"),
    // Penolakan wajib beralasan (PRD 5.5 butir 4).
    rejectionReason: z
      .string({
        required_error: "Alasan penolakan wajib diisi",
        invalid_type_error: "Alasan penolakan tidak valid",
      })
      .trim()
      .min(3, "Alasan penolakan minimal 3 karakter")
      .max(300, "Alasan penolakan maksimal 300 karakter"),
  }),
  z.object({
    action: z.literal("COMPLETE_REFUND"),
    refundId: z.string().uuid("Refund tidak valid"),
    // Refund manual wajib menyertakan bukti (PRD 5.6 butir 2).
    proofUrl: z
      .string({
        required_error: "Bukti refund wajib diunggah",
        invalid_type_error: "Bukti refund tidak valid",
      })
      .trim()
      .url("Bukti refund tidak valid")
      .max(500, "URL bukti terlalu panjang"),
    note: z
      .string({ invalid_type_error: "Catatan tidak valid" })
      .trim()
      .max(500, "Catatan maksimal 500 karakter")
      .optional(),
  }),
]);

export const orderCancelRequestSchema = z.object({
  reason: z
    .string({
      required_error: "Alasan pembatalan wajib diisi",
      invalid_type_error: "Alasan pembatalan tidak valid",
    })
    .trim()
    .min(3, "Alasan pembatalan minimal 3 karakter")
    .max(300, "Alasan pembatalan maksimal 300 karakter"),
});

export type AdminOrderListQuery = z.infer<typeof adminOrderListQuerySchema>;
export type AdminOrderActionInput = z.infer<typeof adminOrderActionSchema>;
