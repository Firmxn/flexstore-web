import { requireSiteAdmin } from "@/lib/auth/guard";
import {
  getPlatformSettings,
  shippingSettingsSchema,
  toPlatformSettingsView,
  updateShippingSettings,
} from "@/lib/platform";
import { apiSuccess, validationError, withRouteErrors } from "@/lib/utils/api";

// SITE-03 (PH-08): konfigurasi shipping provider RajaOngkir. Kunci API tetap di
// env; hanya statusnya yang dikirim ke klien.
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
    const parsed = shippingSettingsSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const settings = await updateShippingSettings(parsed.data);
    return apiSuccess({ settings: toPlatformSettingsView(settings) });
  });
}
