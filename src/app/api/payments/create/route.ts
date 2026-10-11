import { getCurrentUser } from "@/lib/auth/session";
import {
  createPaymentForOrder,
  type CreatePaymentErrorCode,
} from "@/lib/payments";
import { paymentCreateSchema } from "@/lib/payments/validation";
import {
  apiError,
  apiSuccess,
  validationError,
  withRouteErrors,
} from "@/lib/utils/api";

// Status HTTP per kode galat pembuatan pembayaran.
const ERROR_STATUS: Record<CreatePaymentErrorCode, number> = {
  ORDER_NOT_FOUND: 404,
  FORBIDDEN: 403,
  ORDER_NOT_PAYABLE: 409,
  PAYMENT_DISABLED: 503,
  PAYMENT_PROVIDER_ERROR: 502,
};

export async function POST(request: Request) {
  return withRouteErrors(async () => {
    const body = await request.json().catch(() => null);
    const parsed = paymentCreateSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    // Identitas dari sesi/cookie, bukan body (OWASP A01). `phone` hanya dipakai
    // jalur guest dan dicocokkan dengan Order.guestPhone di dalam mutasi.
    const user = await getCurrentUser();

    const result = await createPaymentForOrder(parsed.data.orderId, {
      userId: user?.id ?? null,
      phone: parsed.data.phone ?? null,
    });

    if (!result.ok) {
      return apiError(
        result.code,
        result.message,
        ERROR_STATUS[result.code],
      );
    }

    return apiSuccess({ payment: result.payment });
  });
}
