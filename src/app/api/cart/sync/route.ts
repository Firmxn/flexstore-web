import { mergeGuestCartIntoUser } from "@/lib/cart";
import { GUEST_CART_COOKIE, isGuestCartId } from "@/lib/cart/session";
import { auth } from "@/lib/auth";
import { apiSuccess, withRouteErrors } from "@/lib/utils/api";
import { cookies } from "next/headers";

// Menggabungkan keranjang guest ke keranjang customer setelah login/registrasi.
// Aman dipanggil berulang (idempotent): keranjang guest dihapus setelah
// digabung, jadi panggilan berikutnya menjadi no-op.
export async function POST() {
  return withRouteErrors(async () => {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return apiSuccess({ merged: 0 });

    const store = await cookies();
    const guestId = store.get(GUEST_CART_COOKIE)?.value;
    if (!guestId || !isGuestCartId(guestId)) return apiSuccess({ merged: 0 });

    const merged = await mergeGuestCartIntoUser(userId, guestId);
    return apiSuccess({ merged });
  });
}
