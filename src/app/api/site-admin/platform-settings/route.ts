import { requireSiteAdmin } from "@/lib/auth/guard";
import {
  getPlatformSettings,
  platformSettingsSchema,
  toPlatformSettingsView,
  updatePlatformSettings,
} from "@/lib/platform";
import { apiSuccess, validationError, withRouteErrors } from "@/lib/utils/api";

// SITE-01 (PH-08): pengaturan platform (mode pemeliharaan + pendaftaran publik).
export async function GET() {
  return withRouteErrors(async () => {
    const guard = await requireSiteAdmin();
    if (!guard.ok) return guard.response;

    const settings = await getPlatformSettings();
    return apiSuccess({ settings: toPlatformSettingsView(settings) });
  });
}

export async function PATCH(request: Request) {
  return withRouteErrors(async () => {
    const guard = await requireSiteAdmin();
    if (!guard.ok) return guard.response;

    const body = await request.json().catch(() => null);
    const parsed = platformSettingsSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const settings = await updatePlatformSettings(parsed.data);
    return apiSuccess({ settings: toPlatformSettingsView(settings) });
  });
}
