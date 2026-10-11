import { requireStoreAdmin } from "@/lib/auth/guard";
import { getStoreSettings, storeSettingsSchema, updateStoreSettings } from "@/lib/config";
import { apiSuccess, validationError, withRouteErrors } from "@/lib/utils/api";

export async function GET() {
  return withRouteErrors(async () => {
    const guard = await requireStoreAdmin();
    if (!guard.ok) return guard.response;

    const settings = await getStoreSettings();
    return apiSuccess({ settings });
  });
}

export async function PATCH(request: Request) {
  return withRouteErrors(async () => {
    const guard = await requireStoreAdmin();
    if (!guard.ok) return guard.response;

    const body = await request.json().catch(() => null);
    const parsed = storeSettingsSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const settings = await updateStoreSettings(parsed.data);
    return apiSuccess({ settings });
  });
}
