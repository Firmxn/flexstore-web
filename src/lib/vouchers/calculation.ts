import type { Voucher, VoucherType } from "@prisma/client";

export type VoucherBreakdown = {
  voucherId: string;
  code: string;
  type: VoucherType;
  amount: number;
};

export type DiscountResult = {
  productDiscount: number;
  shippingDiscount: number;
  totalDiscount: number;
  breakdown: VoucherBreakdown[];
};

// Baris keranjang yang relevan untuk cakupan voucher (PRD 5.4 butir 1-3).
export type VoucherCartItem = {
  productId: string;
  categoryId: string;
  lineTotal: number;
};

// Voucher + cakupan yang dimuat dari relasi `voucher_products` /
// `voucher_categories`.
export type ScopedVoucher = Voucher & {
  scopeProductIds: string[];
  scopeExcludedProductIds: string[];
  scopeCategoryIds: string[];
};

const round2 = (value: number) => Math.round(value * 100) / 100;

// Dasar potongan voucher = total harga baris yang dicakup.
// - Tanpa cakupan sama sekali: seluruh keranjang (perilaku PH-05).
// - Ada cakupan: baris yang cocok produk eligible ATAU kategori, lalu produk
//   yang dikecualikan dibuang.
export function voucherEligibleTotal(
  voucher: ScopedVoucher,
  items: VoucherCartItem[],
): number {
  const hasScope =
    voucher.scopeProductIds.length > 0 ||
    voucher.scopeCategoryIds.length > 0 ||
    voucher.scopeExcludedProductIds.length > 0;
  if (!hasScope) {
    return items.reduce((sum, item) => sum + item.lineTotal, 0);
  }

  const eligibleProducts = new Set(voucher.scopeProductIds);
  const categories = new Set(voucher.scopeCategoryIds);
  const excludedProducts = new Set(voucher.scopeExcludedProductIds);
  const restrictByProductOrCategory =
    voucher.scopeProductIds.length > 0 || voucher.scopeCategoryIds.length > 0;

  return items.reduce((sum, item) => {
    if (excludedProducts.has(item.productId)) return sum;
    const matches =
      eligibleProducts.has(item.productId) || categories.has(item.categoryId);
    if (restrictByProductOrCategory && !matches) return sum;
    return sum + item.lineTotal;
  }, 0);
}

// Kalkulasi bertahap (PRD 5.3): nominal dulu, baru persentase, dihitung dari
// harga sisa supaya potongan lebih kecil (seller-oriented). Voucher ongkir
// dihitung terpisah dan tidak mempengaruhi potongan produk. Urutan antar
// voucher sejenis memakai kode menaik supaya hasil konsisten walaupun pembeli
// memasukkan kode dalam urutan berbeda (PRD 5.3 C). Setiap voucher dibatasi
// oleh total harga baris yang dicakupnya.
export function calculateDiscount(
  vouchers: ScopedVoucher[],
  items: VoucherCartItem[],
  subtotal: number,
  shippingCost: number,
): DiscountResult {
  const nominal = vouchers
    .filter((voucher) => voucher.type === "NOMINAL")
    .sort((a, b) => a.code.localeCompare(b.code));
  const percentage = vouchers
    .filter((voucher) => voucher.type === "PERCENTAGE")
    .sort((a, b) => a.code.localeCompare(b.code));
  const shipping = vouchers
    .filter((voucher) => voucher.type === "SHIPPING")
    .sort((a, b) => a.code.localeCompare(b.code));

  const breakdown: VoucherBreakdown[] = [];
  let remaining = subtotal;

  for (const voucher of nominal) {
    const base = Math.min(voucherEligibleTotal(voucher, items), remaining);
    const amount = Math.min(Number(voucher.discountAmount ?? 0), base);
    if (amount <= 0) continue;
    remaining = round2(remaining - amount);
    breakdown.push({
      voucherId: voucher.id,
      code: voucher.code,
      type: voucher.type,
      amount: round2(amount),
    });
  }

  for (const voucher of percentage) {
    const base = Math.min(voucherEligibleTotal(voucher, items), remaining);
    const raw = (base * Number(voucher.discountPercentage ?? 0)) / 100;
    const capped =
      voucher.maxDiscount != null
        ? Math.min(raw, Number(voucher.maxDiscount))
        : raw;
    const amount = Math.min(capped, remaining);
    if (amount <= 0) continue;
    remaining = round2(remaining - amount);
    breakdown.push({
      voucherId: voucher.id,
      code: voucher.code,
      type: voucher.type,
      amount: round2(amount),
    });
  }

  let shippingRemaining = shippingCost;
  for (const voucher of shipping) {
    const amount = Math.min(Number(voucher.discountAmount ?? 0), shippingRemaining);
    if (amount <= 0) continue;
    shippingRemaining = round2(shippingRemaining - amount);
    breakdown.push({
      voucherId: voucher.id,
      code: voucher.code,
      type: voucher.type,
      amount: round2(amount),
    });
  }

  const productDiscount = round2(subtotal - remaining);
  const shippingDiscount = round2(shippingCost - shippingRemaining);

  return {
    productDiscount,
    shippingDiscount,
    totalDiscount: round2(productDiscount + shippingDiscount),
    breakdown,
  };
}
