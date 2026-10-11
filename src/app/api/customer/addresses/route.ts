import { revalidatePath } from "next/cache";
import { requireCustomer } from "@/lib/auth/guard";
import {
  createAddress,
  getAddresses,
  addressInputSchema,
} from "@/lib/customers";
import {
  apiError,
  apiSuccess,
  forbidden,
  validationError,
  withRouteErrors,
} from "@/lib/utils/api";

// CUST-01 (PH-07): daftar dan tambah alamat customer. Hanya customer yang
// boleh; role lain (mis. Store Admin) ditolak (OWASP A01).

export async function GET() {
  return withRouteErrors(async () => {
    const guard = await requireCustomer();
    if (!guard.ok) return guard.response;
    if (guard.user.role !== "CUSTOMER") return forbidden();

    const addresses = await getAddresses(guard.user.id);
    return apiSuccess({ addresses });
  });
}

export async function POST(request: Request) {
  return withRouteErrors(async () => {
    const guard = await requireCustomer();
    if (!guard.ok) return guard.response;
    if (guard.user.role !== "CUSTOMER") return forbidden();

    const body = await request.json().catch(() => null);
    const parsed = addressInputSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const result = await createAddress(guard.user.id, parsed.data);
    if (!result.ok) {
      return apiError(result.code, result.message, result.code === "LIMIT_REACHED" ? 409 : 404);
    }

    // Hapus cache segmen halaman alamat supaya `router.refresh()` di UI
    // mengambil data baru (partialPrefetching/cacheComponents menyimpan
    // payload RSC lama).
    revalidatePath("/profile/addresses", "page");

    return apiSuccess({ id: result.id }, 201);
  });
}
