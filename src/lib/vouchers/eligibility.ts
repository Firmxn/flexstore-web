import { prisma } from "@/lib/db/prisma";
import { formatRupiah } from "@/lib/utils/format";
import {
  voucherEligibleTotal,
  type ScopedVoucher,
  type VoucherCartItem,
} from "./calculation";

export const MAX_VOUCHERS = 2;

export type VoucherContext = {
  items: VoucherCartItem[];
  subtotal: number;
  shippingCost: number;
  phone: string | null;
};

export type VoucherError = { code: string; reason: string };

export type ResolveVouchersResult =
  | { ok: true; vouchers: ScopedVoucher[] }
  | { ok: false; errors: VoucherError[] };

export function normalizeVoucherCode(code: string): string {
  return code.trim().toUpperCase();
}

// Pasangan voucher hanya boleh digabung bila admin mencatatnya sebagai
// kompatibel. Pasangan tanpa baris dianggap TIDAK kompatibel (default menolak).
async function isStackAllowed(aId: string, bId: string): Promise<boolean> {
  const pair = await prisma.voucherCompatibility.findFirst({
    where: {
      OR: [
        { voucherAId: aId, voucherBId: bId },
        { voucherAId: bId, voucherBId: aId },
      ],
    },
    select: { isAllowed: true },
  });
  return pair?.isAllowed ?? false;
}

// Validasi kode voucher terhadap keranjang dan aturan (PRD 5.4). Dipakai baik
// untuk pratinjau di checkout maupun perhitungan final saat pesanan dibuat.
export async function resolveVouchers(
  rawCodes: string[],
  context: VoucherContext,
): Promise<ResolveVouchersResult> {
  const codes = [...new Set(rawCodes.map(normalizeVoucherCode).filter(Boolean))];
  if (codes.length === 0) return { ok: true, vouchers: [] };

  if (codes.length > MAX_VOUCHERS) {
    return {
      ok: false,
      errors: codes.map((code) => ({
        code,
        reason: `Maksimal ${MAX_VOUCHERS} voucher per transaksi`,
      })),
    };
  }

  const now = new Date();
  const found = await prisma.voucher.findMany({
    where: { code: { in: codes } },
    include: {
      products: { select: { productId: true, kind: true } },
      categories: { select: { categoryId: true } },
    },
  });

  const byCode = new Map<string, ScopedVoucher>(
    found.map((voucher) => [
      voucher.code,
      {
        ...voucher,
        scopeProductIds: voucher.products
          .filter((row) => row.kind === "ELIGIBLE")
          .map((row) => row.productId),
        scopeExcludedProductIds: voucher.products
          .filter((row) => row.kind === "EXCLUDED")
          .map((row) => row.productId),
        scopeCategoryIds: voucher.categories.map((row) => row.categoryId),
      },
    ]),
  );

  const errors: VoucherError[] = [];
  const valid: ScopedVoucher[] = [];

  for (const code of codes) {
    const voucher = byCode.get(code);
    if (!voucher) {
      errors.push({ code, reason: "Kode voucher tidak ditemukan" });
      continue;
    }
    if (!voucher.isActive) {
      errors.push({ code, reason: "Voucher tidak aktif" });
      continue;
    }
    if (voucher.validFrom > now) {
      errors.push({ code, reason: "Voucher belum berlaku" });
      continue;
    }
    if (voucher.validUntil < now) {
      errors.push({ code, reason: "Voucher sudah kedaluwarsa" });
      continue;
    }

    // Cakupan produk/kategori: dasar potongan adalah baris yang dicakup.
    const eligibleTotal = voucherEligibleTotal(voucher, context.items);
    if (eligibleTotal <= 0) {
      errors.push({
        code,
        reason: "Voucher tidak berlaku untuk produk di keranjang",
      });
      continue;
    }
    if (eligibleTotal < Number(voucher.minTransaction)) {
      errors.push({
        code,
        reason: `Minimal belanja ${formatRupiah(Number(voucher.minTransaction))}`,
      });
      continue;
    }
    if (voucher.usageLimit != null && voucher.usageCount >= voucher.usageLimit) {
      errors.push({ code, reason: "Kuota voucher sudah habis" });
      continue;
    }
    if (voucher.usageLimitPerPhone != null && context.phone) {
      const used = await prisma.voucherUsage.count({
        where: { voucherId: voucher.id, phone: context.phone },
      });
      if (used >= voucher.usageLimitPerPhone) {
        errors.push({
          code,
          reason: "Voucher sudah dipakai untuk nomor HP ini",
        });
        continue;
      }
    }
    valid.push(voucher);
  }

  if (valid.length > 1) {
    for (let i = 0; i < valid.length; i += 1) {
      for (let j = i + 1; j < valid.length; j += 1) {
        if (!(await isStackAllowed(valid[i].id, valid[j].id))) {
          errors.push({
            code: valid[j].code,
            reason: `Tidak bisa digabung dengan ${valid[i].code}`,
          });
        }
      }
    }
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, vouchers: valid };
}
