import { z } from "zod";
import { phoneSchema } from "@/lib/auth/validation";

// Permintaan pembuatan pembayaran. Identitas selalu dari sesi/cookie, bukan
// body; `phone` hanya jalur guest (dibandingkan dengan Order.guestPhone).
export const paymentCreateSchema = z.object({
  orderId: z.string().uuid("Pesanan tidak valid"),
  phone: phoneSchema.optional(),
});

// Payload webhook Xendit. Field yang tidak dipakai diteruskan (passthrough)
// agar perubahan kecil di sisi Xendit tidak menolak webhook yang sah.
export const xenditWebhookSchema = z
  .object({
    id: z.string().min(1),
    external_id: z.string().min(1),
    status: z.string().min(1),
    paid_at: z.string().nullish(),
    expiry_date: z.string().nullish(),
  })
  .passthrough();

export type PaymentCreateInput = z.infer<typeof paymentCreateSchema>;
export type XenditWebhookPayload = z.infer<typeof xenditWebhookSchema>;
