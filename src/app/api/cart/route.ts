import {
  addToCart,
  attachGuestCartCookie,
  createGuestCartId,
  getCart,
  getCartAccess,
  removeFromCart,
  updateCartItem,
  type CartIdentity,
} from "@/lib/cart";
import {
  addCartItemSchema,
  removeCartItemSchema,
  updateCartItemSchema,
} from "@/lib/cart/validation";
import {
  apiError,
  apiSuccess,
  forbidden,
  validationError,
  withRouteErrors,
} from "@/lib/utils/api";
import { NextResponse } from "next/server";

// Identitas keranjang: customer (sesi) atau guest (cookie). Guest baru yang
// belum punya cookie dibuatkan ID saat operasi tulis pertama. Sesi dengan role
// non-customer (mis. admin) ditolak supaya tidak jatuh ke keranjang guest.
async function resolveIdentity(): Promise<
  | { ok: true; identity: CartIdentity; newGuestId: string | null }
  | { ok: false; response: NextResponse }
> {
  const access = await getCartAccess();
  if (!access.ok) return { ok: false, response: forbidden() };
  if (access.identity) {
    return { ok: true, identity: access.identity, newGuestId: null };
  }
  const guestId = createGuestCartId();
  return { ok: true, identity: { kind: "guest", guestId }, newGuestId: guestId };
}

function mutationErrorResponse(result: {
  code: string;
  message: string;
  remaining?: number;
}) {
  switch (result.code) {
    case "VARIANT_NOT_FOUND":
      return apiError("VARIANT_NOT_FOUND", result.message, 404, "variantId");
    case "PRODUCT_INACTIVE":
      return apiError("PRODUCT_INACTIVE", result.message, 400, "variantId");
    case "INSUFFICIENT_STOCK":
      return apiError("INSUFFICIENT_STOCK", result.message, 400, "quantity");
    default:
      return apiError("INTERNAL_ERROR", "Terjadi kesalahan, coba lagi", 500);
  }
}

async function respondWithCart(identity: CartIdentity, newGuestId: string | null) {
  const cart = await getCart(identity);
  const response = apiSuccess({ cart });
  if (newGuestId) attachGuestCartCookie(response, newGuestId);
  return response;
}

export async function GET() {
  return withRouteErrors(async () => {
    const access = await getCartAccess();
    if (!access.ok) return forbidden();
    if (!access.identity) {
      return apiSuccess({ cart: { items: [], subtotal: 0, itemCount: 0 } });
    }
    const cart = await getCart(access.identity);
    return apiSuccess({ cart });
  });
}

export async function POST(request: Request) {
  return withRouteErrors(async () => {
    const resolved = await resolveIdentity();
    if (!resolved.ok) return resolved.response;

    const body = await request.json().catch(() => null);
    const parsed = addCartItemSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const result = await addToCart(
      resolved.identity,
      parsed.data.variantId,
      parsed.data.quantity,
    );
    if (!result.ok) return mutationErrorResponse(result);

    return respondWithCart(resolved.identity, resolved.newGuestId);
  });
}

export async function PATCH(request: Request) {
  return withRouteErrors(async () => {
    const resolved = await resolveIdentity();
    if (!resolved.ok) return resolved.response;

    const body = await request.json().catch(() => null);
    const parsed = updateCartItemSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const result = await updateCartItem(
      resolved.identity,
      parsed.data.variantId,
      parsed.data.quantity,
    );
    if (!result.ok) return mutationErrorResponse(result);

    return respondWithCart(resolved.identity, resolved.newGuestId);
  });
}

export async function DELETE(request: Request) {
  return withRouteErrors(async () => {
    const resolved = await resolveIdentity();
    if (!resolved.ok) return resolved.response;

    const body = await request.json().catch(() => null);
    const parsed = removeCartItemSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const result = await removeFromCart(resolved.identity, parsed.data.variantId);
    if (!result.ok) return mutationErrorResponse(result);

    return respondWithCart(resolved.identity, resolved.newGuestId);
  });
}
