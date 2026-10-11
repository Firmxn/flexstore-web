import { requireStoreAdmin } from "@/lib/auth/guard";
import {
  cancellationReasonSchema,
  createCancellationReason,
  listCancellationReasons,
} from "@/lib/config";
import { apiSuccess, validationError, withRouteErrors } from "@/lib/utils/api";

export async function GET() {
  return withRouteErrors(async () => {
    const guard = await requireStoreAdmin();
    if (!guard.ok) return guard.response;

    const reasons = await listCancellationReasons();
    return apiSuccess({ reasons });
  });
}

export async function POST(request: Request) {
  return withRouteErrors(async () => {
    const guard = await requireStoreAdmin();
    if (!guard.ok) return guard.response;

    const body = await request.json().catch(() => null);
    const parsed = cancellationReasonSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const reason = await createCancellationReason(parsed.data);
    return apiSuccess({ reason }, 201);
  });
}
