import { z } from "zod";
import { requireSiteAdmin } from "@/lib/auth/guard";
import {
  findStoreAdmin,
  updateStoreAdmin,
  updateStoreAdminSchema,
} from "@/lib/platform";
import {
  apiError,
  apiSuccess,
  notFound,
  validationError,
  withRouteErrors,
} from "@/lib/utils/api";

const idSchema = z.string().uuid();

type Context = { params: Promise<{ id: string }> };

// SITE-04 (PH-08): aktif/nonaktifkan akun Store Admin dan reset passwordnya.
export async function PATCH(request: Request, context: Context) {
  return withRouteErrors(async () => {
    const guard = await requireSiteAdmin();
    if (!guard.ok) return guard.response;

    const { id } = await context.params;
    if (!idSchema.safeParse(id).success) {
      return apiError("INVALID_ID", "ID tidak valid", 400);
    }

    const body = await request.json().catch(() => null);
    const parsed = updateStoreAdminSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    // Target wajib akun Store Admin. Akun Site Admin/Customer → 404 supaya
    // keberadaan akun lain tidak bocor.
    const target = await findStoreAdmin(id);
    if (!target) return notFound("Akun Store Admin tidak ditemukan");

    if (target.id === guard.user.id) {
      return apiError("SELF_TARGET", "Tidak bisa mengubah akun sendiri", 403);
    }

    const count = await updateStoreAdmin(id, parsed.data);
    if (count === 0) return notFound("Akun Store Admin tidak ditemukan");

    return apiSuccess({ id });
  });
}
