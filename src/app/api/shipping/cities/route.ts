import { searchShippingDestinations } from "@/lib/shipping";
import { citySearchSchema } from "@/lib/shipping/validation";
import { apiSuccess, validationError, withRouteErrors } from "@/lib/utils/api";

// Pencarian kecamatan/kota tujuan (proxy RajaOngkir Komerce, dicache 5 menit).
// Kalau API key belum diset, balas `configured: false` supaya UI tahu hanya
// tarif flat yang tersedia.
export async function GET(request: Request) {
  return withRouteErrors(async () => {
    const searchParams = Object.fromEntries(new URL(request.url).searchParams);
    const parsed = citySearchSchema.safeParse(searchParams);
    if (!parsed.success) return validationError(parsed.error);

    const result = await searchShippingDestinations(parsed.data.search);
    return apiSuccess(result);
  });
}
