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

const round2 = (value: number) => Math.round(value * 100) / 100;

// Kalkulasi bertahap (PRD 5.3): nominal dulu, baru persentase, dihitung dari
// harga sisa supaya potongan lebih kecil (seller-oriented). Voucher ongkir
// dihitung terpisah dan tidak mempengaruhi potongan produk. Urutan antar
// voucher sejenis memakai kode menaik supaya hasil konsisten walaupun pembeli
// memasukkan kode dalam urutan berbeda (PRD 5.3 C).
export function calculateDiscount(
  vouchers: Voucher[],
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
    const amount = Math.min(Number(voucher.discountAmount ?? 0), remaining);
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
    const raw = (remaining * Number(voucher.discountPercentage ?? 0)) / 100;
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
