import { requireCustomer } from "@/lib/auth/guard";
import { reorderFromOrder } from "@/lib/orders";
import {
  apiError,
  apiSuccess,
  forbidden,
  withRouteErrors,
} from "@/lib/utils/api";

// ORDER-03 lanjutan (PH-07): tambahkan item pesanan lama ke keranjang.
// Hanya pemilik pesanan (customer) yang boleh.

type Context = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: Context) {
  return withRouteErrors(async () => {
    const guard = await requireCustomer();
    if (!guard.ok) return guard.response;
    if (guard.user.role !== "CUSTOMER") return forbidden();

    const { id } = await context.params;
    const result = await reorderFromOrder(guard.user.id, id);

    if (!result.ok) {
      return apiError(
        result.code,
        result.message,
        result.code === "NOT_FOUND" ? 404 : 400,
      );
    }

    return apiSuccess({ added: result.added, skipped: result.skipped });
  });
}
