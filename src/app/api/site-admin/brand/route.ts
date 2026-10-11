import { requireSiteAdmin } from "@/lib/auth/guard";
import {
  brandSettingsSchema,
  readBrandSetting,
  updateBrandSettings,
} from "@/lib/brand";
import { apiSuccess, validationError, withRouteErrors } from "@/lib/utils/api";

// SITE-05 (PH-09): identitas brand per deployment (nama, logo, favicon,
// tagline, palet warna, teks footer, banner homepage).
//
// GET memakai pembacaan tanpa cache: API ini dipakai form Site Admin, yang harus
// selalu melihat nilai terbaru dari database (tampilan publik tetap memakai
// `getBrandSetting()` yang ber-cache dan dibatalkan lewat tag).
export async function GET() {
  return withRouteErrors(async () => {
    const guard = await requireSiteAdmin();
    if (!guard.ok) return guard.response;

    const brand = await readBrandSetting();
    return apiSuccess({ brand });
  });
}

export async function PATCH(request: Request) {
  return withRouteErrors(async () => {
    const guard = await requireSiteAdmin();
    if (!guard.ok) return guard.response;

    const body = await request.json().catch(() => null);
    const parsed = brandSettingsSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const brand = await updateBrandSettings(parsed.data);
    return apiSuccess({ brand });
  });
}
