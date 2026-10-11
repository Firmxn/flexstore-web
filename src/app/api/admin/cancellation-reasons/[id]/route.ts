import { z } from "zod";
import { requireStoreAdmin } from "@/lib/auth/guard";
import {
  cancellationReasonSchema,
  deleteCancellationReason,
  updateCancellationReason,
} from "@/lib/config";
import {
  apiError,
  apiSuccess,
  notFound,
  validationError,
  withRouteErrors,
} from "@/lib/utils/api";

const idSchema = z.string().uuid();

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  return withRouteErrors(async () => {
    const guard = await requireStoreAdmin();
    if (!guard.ok) return guard.response;

    const { id } = await context.params;
    if (!idSchema.safeParse(id).success) {
      return apiError("INVALID_ID", "ID tidak valid", 400);
    }

    const body = await request.json().catch(() => null);
    const parsed = cancellationReasonSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const updated = await updateCancellationReason(id, parsed.data);
    if (!updated) return notFound("Template alasan tidak ditemukan");

    return apiSuccess({ ok: true });
  });
}

export async function DELETE(_request: Request, context: Context) {
  return withRouteErrors(async () => {
    const guard = await requireStoreAdmin();
    if (!guard.ok) return guard.response;

    const { id } = await context.params;
    if (!idSchema.safeParse(id).success) {
      return apiError("INVALID_ID", "ID tidak valid", 400);
    }

    const deleted = await deleteCancellationReason(id);
    if (!deleted) return notFound("Template alasan tidak ditemukan");

    return apiSuccess({ deleted: true });
  });
}
