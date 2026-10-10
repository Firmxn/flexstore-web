import { timingSafeEqual } from "node:crypto";
import { getXenditWebhookToken } from "@/lib/payments/config";
import { applyExpiredPayment, applyPaidPayment } from "@/lib/payments/mutations";
import { xenditWebhookSchema } from "@/lib/payments/validation";
import { apiError, apiSuccess, withRouteErrors } from "@/lib/utils/api";

// Perbandingan waktu-tetap supaya token tidak bisa ditebak lewat selisih waktu.
function tokensMatch(received: string, expected: string): boolean {
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  return withRouteErrors(async () => {
    const expectedToken = getXenditWebhookToken();
    if (!expectedToken) {
      console.error("[xendit] XENDIT_WEBHOOK_TOKEN belum diisi di .env.local");
      return apiError(
        "WEBHOOK_NOT_CONFIGURED",
        "Webhook belum dikonfigurasi",
        503,
      );
    }

    // Verifikasi asal webhook lewat header x-callback-token (OWASP A08).
    const receivedToken = request.headers.get("x-callback-token") ?? "";
    if (!tokensMatch(receivedToken, expectedToken)) {
      return apiError("INVALID_CALLBACK_TOKEN", "Token tidak valid", 401);
    }

    const raw = await request.text();
    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      return apiError("INVALID_PAYLOAD", "Payload tidak valid", 400);
    }

    const parsed = xenditWebhookSchema.safeParse(json);
    if (!parsed.success) {
      return apiError("INVALID_PAYLOAD", "Payload tidak valid", 400);
    }

    const { external_id: externalId, status, paid_at: paidAt } = parsed.data;

    if (status === "PAID" || status === "SETTLED") {
      const result = await applyPaidPayment(
        externalId,
        paidAt ? new Date(paidAt) : new Date(),
      );
      if (result === "NOT_FOUND") {
        console.error("[xendit] webhook untuk pembayaran tak dikenal", {
          externalId,
        });
        return apiError("PAYMENT_NOT_FOUND", "Pembayaran tidak ditemukan", 404);
      }
      return apiSuccess({ received: true, result });
    }

    if (status === "EXPIRED") {
      const result = await applyExpiredPayment(externalId);
      if (result === "NOT_FOUND") {
        console.error("[xendit] webhook untuk pembayaran tak dikenal", {
          externalId,
        });
        return apiError("PAYMENT_NOT_FOUND", "Pembayaran tidak ditemukan", 404);
      }
      return apiSuccess({ received: true, result });
    }

    // Status lain dijawab 200 supaya Xendit berhenti mengirim ulang.
    return apiSuccess({ received: true, result: "IGNORED" });
  });
}
