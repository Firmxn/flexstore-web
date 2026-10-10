import { isPhoneVerified } from "@/lib/auth/otp";
import { getCartIdentity } from "@/lib/cart";
import {
  attachGuestAccessCookie,
  createOrder,
  type CreateOrderErrorCode,
} from "@/lib/orders";
import { orderCreateSchema } from "@/lib/orders/validation";
import { isShippingApiConfigured } from "@/lib/shipping";
import {
  apiError,
  apiSuccess,
  validationError,
  withRouteErrors,
} from "@/lib/utils/api";

// Status HTTP per kode galat pembuatan pesanan.
const ERROR_STATUS: Record<CreateOrderErrorCode, number> = {
  CART_EMPTY: 400,
  VARIANT_NOT_FOUND: 404,
  PRODUCT_INACTIVE: 400,
  INSUFFICIENT_STOCK: 400,
  INVALID_SHIPPING_METHOD: 400,
};

export async function POST(request: Request) {
  return withRouteErrors(async () => {
    const body = await request.json().catch(() => null);
    const parsed = orderCreateSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    // Identitas diambil dari sesi/cookie, bukan body (OWASP A01).
    const identity = await getCartIdentity();
    if (!identity) return apiError("CART_EMPTY", "Keranjang kosong", 400);

    const isGuest = identity.kind === "guest";

    // Tujuan wajib hanya kalau API ongkir aktif; tanpa API key tarif flat dipakai.
    if (isShippingApiConfigured() && !parsed.data.destinationId) {
      return apiError("VALIDATION_ERROR", "Tujuan wajib dipilih", 400, "destinationId");
    }

    if (isGuest) {
      const guestPhone = parsed.data.guestPhone;
      if (!guestPhone) {
        return apiError(
          "VALIDATION_ERROR",
          "Nomor HP wajib diisi",
          400,
          "guestPhone",
        );
      }
      // Guest wajib nomor HP terverifikasi (AUTH-01). Penanda ada di Redis,
      // jadi tidak bisa dipalsukan dari klien.
      if (!(await isPhoneVerified(guestPhone))) {
        return apiError(
          "PHONE_NOT_VERIFIED",
          "Verifikasi nomor HP terlebih dahulu",
          403,
          "guestPhone",
        );
      }
    }

    const result = await createOrder({
      identity,
      variantIds: parsed.data.variantIds,
      address: parsed.data.address,
      destinationId: parsed.data.destinationId ?? "",
      courierCode: parsed.data.courierCode,
      service: parsed.data.service,
      guestPhone: isGuest ? (parsed.data.guestPhone ?? null) : null,
      guestEmail: parsed.data.guestEmail ?? null,
    });

    if (!result.ok) {
      return apiError(
        result.code,
        result.message,
        ERROR_STATUS[result.code],
        result.field,
      );
    }

    const response = apiSuccess({ order: result.order }, 201);
    // Guest: terbitkan tiket akses halaman pesanan (bukan sesi login) supaya
    // setelah checkout bisa langsung ke halaman pembayaran yang sama.
    if (isGuest && parsed.data.guestPhone) {
      attachGuestAccessCookie(response, parsed.data.guestPhone);
    }
    return response;
  });
}
