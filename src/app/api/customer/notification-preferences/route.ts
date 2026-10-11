import { requireCustomer } from "@/lib/auth/guard";
import {
  getNotificationPreferences,
  notificationPreferenceSchema,
  updateNotificationPreferences,
} from "@/lib/customers";
import {
  apiSuccess,
  forbidden,
  validationError,
  withRouteErrors,
} from "@/lib/utils/api";

// CUST-02 (PH-07, PRD 4.8): preferensi notifikasi customer. Hanya customer.

export async function GET() {
  return withRouteErrors(async () => {
    const guard = await requireCustomer();
    if (!guard.ok) return guard.response;
    if (guard.user.role !== "CUSTOMER") return forbidden();

    const preferences = await getNotificationPreferences(guard.user.id);
    return apiSuccess({ preferences });
  });
}

export async function PATCH(request: Request) {
  return withRouteErrors(async () => {
    const guard = await requireCustomer();
    if (!guard.ok) return guard.response;
    if (guard.user.role !== "CUSTOMER") return forbidden();

    const body = await request.json().catch(() => null);
    const parsed = notificationPreferenceSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const row = await updateNotificationPreferences(guard.user.id, parsed.data);
    return apiSuccess({
      preferences: {
        orderConfirmation: row.orderConfirmation,
        paymentConfirmation: row.paymentConfirmation,
        shippingUpdate: row.shippingUpdate,
        cancellationUpdate: row.cancellationUpdate,
        refundUpdate: row.refundUpdate,
      },
    });
  });
}
