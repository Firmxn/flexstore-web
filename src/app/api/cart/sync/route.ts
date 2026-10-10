import { mergeGuestCartIntoUser } from "@/lib/cart";
import { GUEST_CART_COOKIE, getCartAccess, isGuestCartId } from "@/lib/cart/session";
import { apiSuccess, forbidden, withRouteErrors } from "@/lib/utils/api";
import { cookies } from "next/headers";

// Menggabungkan keranjang guest ke keranjang customer setelah login/registrasi.
// Aman dipanggil berulang (idempotent): keranjang guest dihapus setelah
// digabung, jadi panggilan berikutnya menjadi no-op. Role non-customer
// (mis. admin) ditolak karena tidak berbelanja.
export async function POST() {
  return withRouteErrors(async () => {
    const access = await getCartAccess();
    if (!access.ok) return forbidden();
    if (!access.identity || access.identity.kind !== "user") {
      return apiSuccess({ merged: 0 });
    }

    const store = await cookies();
    const guestId = store.get(GUEST_CART_COOKIE)?.value;
    if (!guestId || !isGuestCartId(guestId)) return apiSuccess({ merged: 0 });

    const merged = await mergeGuestCartIntoUser(access.identity.userId, guestId);
    return apiSuccess({ merged });
  });
}
