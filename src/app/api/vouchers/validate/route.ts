import { getCartAccess, getCartRawItems } from "@/lib/cart";
import { prisma } from "@/lib/db/prisma";
import {
  calculateDiscount,
  resolveVouchers,
  voucherValidateSchema,
} from "@/lib/vouchers";
import {
  apiError,
  apiSuccess,
  forbidden,
  validationError,
  withRouteErrors,
} from "@/lib/utils/api";

const EMPTY_DISCOUNT = {
  productDiscount: 0,
  shippingDiscount: 0,
  totalDiscount: 0,
  breakdown: [],
};

// Pratinjau voucher di checkout. Subtotal dihitung server dari keranjang, bukan
// dari klien (OWASP A03/A04). Perhitungan final tetap diulang saat pesanan
// dibuat, jadi nilai di sini hanya untuk tampilan.
export async function POST(request: Request) {
  return withRouteErrors(async () => {
    const access = await getCartAccess();
    if (!access.ok) return forbidden();
    const identity = access.identity;

    const body = await request.json().catch(() => null);
    const parsed = voucherValidateSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    if (!identity) return apiError("CART_EMPTY", "Keranjang kosong", 400);

    const rawItems = await getCartRawItems(identity);
    const quantityMap = new Map(rawItems.map((item) => [item.variantId, item.quantity]));
    const selected = parsed.data.variantIds.filter((id) => quantityMap.has(id));
    if (selected.length === 0) {
      return apiError("CART_EMPTY", "Keranjang kosong", 400);
    }

    const variants = await prisma.productVariant.findMany({
      where: { id: { in: selected } },
      select: {
        id: true,
        price: true,
        productId: true,
        product: { select: { categoryId: true } },
      },
    });
    const variantMap = new Map(variants.map((variant) => [variant.id, variant]));

    // Cakupan voucher butuh productId + categoryId per baris (PRD 5.4).
    const items = selected.flatMap((id) => {
      const variant = variantMap.get(id);
      if (!variant) return [];
      const quantity = quantityMap.get(id) ?? 0;
      return [
        {
          productId: variant.productId,
          categoryId: variant.product.categoryId,
          lineTotal: Number(variant.price) * quantity,
        },
      ];
    });
    const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);

    const resolved = await resolveVouchers(parsed.data.codes, {
      items,
      subtotal,
      shippingCost: parsed.data.shippingCost,
      phone: parsed.data.phone ?? null,
    });

    if (!resolved.ok) {
      return apiSuccess({
        valid: false,
        subtotal,
        discount: EMPTY_DISCOUNT,
        errors: resolved.errors,
      });
    }

    const discount = calculateDiscount(
      resolved.vouchers,
      items,
      subtotal,
      parsed.data.shippingCost,
    );

    return apiSuccess({ valid: true, subtotal, discount, errors: [] });
  });
}
