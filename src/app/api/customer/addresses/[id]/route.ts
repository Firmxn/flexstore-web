import { z } from "zod";
import { requireCustomer } from "@/lib/auth/guard";
import {
  addressUpdateSchema,
  deleteAddress,
  updateAddress,
} from "@/lib/customers";
import {
  apiError,
  apiSuccess,
  forbidden,
  notFound,
  validationError,
  withRouteErrors,
} from "@/lib/utils/api";

// CUST-01 (PH-07): ubah dan hapus alamat milik sendiri. Alamat customer lain
// menghasilkan 404 generik, bukan 403 (OWASP A01).

const idSchema = z.string().uuid();

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  return withRouteErrors(async () => {
    const guard = await requireCustomer();
    if (!guard.ok) return guard.response;
    if (guard.user.role !== "CUSTOMER") return forbidden();

    const { id } = await context.params;
    if (!idSchema.safeParse(id).success) {
      return apiError("INVALID_ID", "ID tidak valid", 400);
    }

    const body = await request.json().catch(() => null);
    const parsed = addressUpdateSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const result = await updateAddress(guard.user.id, id, parsed.data);
    if (!result.ok) return notFound(result.message);

    return apiSuccess({ id: result.id });
  });
}

export async function DELETE(_request: Request, context: Context) {
  return withRouteErrors(async () => {
    const guard = await requireCustomer();
    if (!guard.ok) return guard.response;
    if (guard.user.role !== "CUSTOMER") return forbidden();

    const { id } = await context.params;
    if (!idSchema.safeParse(id).success) {
      return apiError("INVALID_ID", "ID tidak valid", 400);
    }

    const result = await deleteAddress(guard.user.id, id);
    if (!result.ok) return notFound(result.message);

    return apiSuccess({ id: result.id });
  });
}
