import { z } from "zod";
import { requireStoreAdmin } from "@/lib/auth/guard";
import {
  adminOrderActionSchema,
  approveCancellation,
  completeRefund,
  markOrderCompleted,
  markOrderShipped,
  rejectCancellation,
} from "@/lib/orders";
import {
  apiError,
  apiSuccess,
  validationError,
  withRouteErrors,
} from "@/lib/utils/api";

const idSchema = z.string().uuid();

type Context = { params: Promise<{ id: string }> };

// Aksi admin atas satu pesanan (ORDER-05/06/07). Satu endpoint dengan
// discriminated union supaya tiap aksi hanya menerima field yang relevan.
export async function PATCH(request: Request, context: Context) {
  return withRouteErrors(async () => {
    const guard = await requireStoreAdmin();
    if (!guard.ok) return guard.response;

    const { id } = await context.params;
    if (!idSchema.safeParse(id).success) {
      return apiError("INVALID_ID", "ID tidak valid", 400);
    }

    const body = await request.json().catch(() => null);
    const parsed = adminOrderActionSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const input = parsed.data;
    const result =
      input.action === "SHIP"
        ? await markOrderShipped(id, input.trackingNumber)
        : input.action === "COMPLETE"
          ? await markOrderCompleted(id)
          : input.action === "APPROVE_CANCEL"
            ? await approveCancellation(id)
            : input.action === "REJECT_CANCEL"
              ? await rejectCancellation(id, input.rejectionReason)
              : await completeRefund(input.refundId, input.proofUrl, input.note);

    if (!result.ok) {
      return apiError(
        result.code,
        result.message,
        result.code === "NOT_FOUND" ? 404 : 409,
      );
    }

    return apiSuccess({ ok: true });
  });
}
