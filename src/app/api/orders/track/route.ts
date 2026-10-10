import { findOrderForTracking } from "@/lib/orders";
import { allowTrackAttempt, getClientIp } from "@/lib/orders/rate-limit";
import { trackOrderSchema } from "@/lib/orders/validation";
import {
  apiError,
  apiSuccess,
  notFound,
  validationError,
  withRouteErrors,
} from "@/lib/utils/api";

export async function POST(request: Request) {
  return withRouteErrors(async () => {
    const body = await request.json().catch(() => null);
    const parsed = trackOrderSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const allowed = await allowTrackAttempt(getClientIp(request));
    if (!allowed) {
      return apiError(
        "RATE_LIMITED",
        "Terlalu banyak percobaan, coba lagi nanti",
        429,
      );
    }

    const order = await findOrderForTracking(
      parsed.data.orderNumber,
      parsed.data.phone,
    );
    // Pesan generik: nomor salah dan pesanan tidak ada tidak dibedakan
    // (AC-ORDER-04-02).
    if (!order) return notFound("Pesanan tidak ditemukan");

    // Data sensitif (userId, guestEmail) tidak ikut dikembalikan.
    return apiSuccess({
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        createdAt: order.createdAt,
        subtotal: Number(order.subtotal),
        shippingCost: Number(order.shippingCost),
        discount: Number(order.discount),
        total: Number(order.total),
        shippingCourier: order.shippingCourier,
        shippingService: order.shippingService,
        shippingEtd: order.shippingEtd,
        shippingAddress: order.shippingAddress,
        items: order.items.map((item) => ({
          productName: item.productName,
          variantName: item.variantName,
          sku: item.sku,
          quantity: item.quantity,
          price: Number(item.price),
        })),
      },
    });
  });
}
