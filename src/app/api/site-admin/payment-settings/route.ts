import { requireSiteAdmin } from "@/lib/auth/guard";
import {
  getPlatformSettings,
  paymentSettingsSchema,
  toPlatformSettingsView,
  updatePaymentSettings,
} from "@/lib/platform";
import { apiSuccess, validationError, withRouteErrors } from "@/lib/utils/api";

// SITE-02 (PH-08): konfigurasi payment gateway Xendit. Kunci API tetap di env;
// hanya statusnya yang dikirim ke klien.
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
    const parsed = paymentSettingsSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const settings = await updatePaymentSettings(parsed.data);
    return apiSuccess({ settings: toPlatformSettingsView(settings) });
  });
}
