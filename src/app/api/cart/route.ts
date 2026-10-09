import {
  addToCart,
  attachGuestCartCookie,
  createGuestCartId,
  getCart,
  getCartIdentity,
  removeFromCart,
  updateCartItem,
  type CartIdentity,
} from "@/lib/cart";
import {
  addCartItemSchema,
  removeCartItemSchema,
  updateCartItemSchema,
} from "@/lib/cart/validation";
import { apiError, apiSuccess, validationError, withRouteErrors } from "@/lib/utils/api";

// Identitas keranjang: customer (sesi) atau guest (cookie). Guest baru yang
// belum punya cookie dibuatkan ID saat operasi tulis pertama.
async function resolveIdentity(): Promise<{
  identity: CartIdentity;
  newGuestId: string | null;
}> {
  const existing = await getCartIdentity();
  if (existing) return { identity: existing, newGuestId: null };
  const guestId = createGuestCartId();
  return { identity: { kind: "guest", guestId }, newGuestId: guestId };
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
    const identity = await getCartIdentity();
    if (!identity) {
      return apiSuccess({ cart: { items: [], subtotal: 0, itemCount: 0 } });
    }
    const cart = await getCart(identity);
    return apiSuccess({ cart });
  });
}

export async function POST(request: Request) {
  return withRouteErrors(async () => {
    const body = await request.json().catch(() => null);
    const parsed = addCartItemSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const { identity, newGuestId } = await resolveIdentity();
    const result = await addToCart(identity, parsed.data.variantId, parsed.data.quantity);
    if (!result.ok) return mutationErrorResponse(result);

    return respondWithCart(identity, newGuestId);
  });
}

export async function PATCH(request: Request) {
  return withRouteErrors(async () => {
    const body = await request.json().catch(() => null);
    const parsed = updateCartItemSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const { identity, newGuestId } = await resolveIdentity();
    const result = await updateCartItem(
      identity,
      parsed.data.variantId,
      parsed.data.quantity,
    );
    if (!result.ok) return mutationErrorResponse(result);

    return respondWithCart(identity, newGuestId);
  });
}

export async function DELETE(request: Request) {
  return withRouteErrors(async () => {
    const body = await request.json().catch(() => null);
    const parsed = removeCartItemSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const { identity, newGuestId } = await resolveIdentity();
    const result = await removeFromCart(identity, parsed.data.variantId);
    if (!result.ok) return mutationErrorResponse(result);

    return respondWithCart(identity, newGuestId);
  });
}
