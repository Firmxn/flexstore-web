import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import type { VoucherInput } from "./validation";

// Field yang boleh diubah; nilai yang tidak relevan dengan jenis voucher
// dikosongkan supaya data tidak ambigu (mis. nominal pada voucher persentase).
function voucherData(input: VoucherInput) {
  const isPercentage = input.type === "PERCENTAGE";
  return {
    code: input.code,
    type: input.type,
    discountPercentage: isPercentage ? (input.discountPercentage ?? null) : null,
    discountAmount: isPercentage ? null : (input.discountAmount ?? null),
    maxDiscount: isPercentage ? (input.maxDiscount ?? null) : null,
    minTransaction: input.minTransaction,
    usageLimit: input.usageLimit ?? null,
    usageLimitPerPhone: input.usageLimitPerPhone ?? null,
    validFrom: input.validFrom,
    validUntil: input.validUntil,
    isActive: input.isActive,
  };
}

async function syncCompatibility(
  tx: Prisma.TransactionClient,
  voucherId: string,
  otherIds: string[],
) {
  const unique = [...new Set(otherIds.filter((id) => id !== voucherId))];
  if (unique.length === 0) return;
  await tx.voucherCompatibility.createMany({
    data: unique.map((otherId) => ({
      voucherAId: voucherId,
      voucherBId: otherId,
      isAllowed: true,
    })),
    skipDuplicates: true,
  });
}

// Cakupan produk/kategori diganti utuh setiap simpan supaya form admin menjadi
// satu-satunya sumber kebenaran. Produk yang masuk daftar eligible tidak
// diulang di daftar excluded (eligible menang).
async function syncScope(
  tx: Prisma.TransactionClient,
  voucherId: string,
  input: VoucherInput,
) {
  await tx.voucherProduct.deleteMany({ where: { voucherId } });
  await tx.voucherCategory.deleteMany({ where: { voucherId } });

  const eligible = [...new Set(input.eligibleProductIds)];
  const eligibleSet = new Set(eligible);
  const excluded = [...new Set(input.excludedProductIds)].filter(
    (productId) => !eligibleSet.has(productId),
  );

  const productRows = [
    ...eligible.map((productId) => ({
      voucherId,
      productId,
      kind: "ELIGIBLE" as const,
    })),
    ...excluded.map((productId) => ({
      voucherId,
      productId,
      kind: "EXCLUDED" as const,
    })),
  ];
  if (productRows.length > 0) {
    await tx.voucherProduct.createMany({ data: productRows, skipDuplicates: true });
  }

  const categoryIds = [...new Set(input.categoryIds)];
  if (categoryIds.length > 0) {
    await tx.voucherCategory.createMany({
      data: categoryIds.map((categoryId) => ({ voucherId, categoryId })),
      skipDuplicates: true,
    });
  }
}

export async function createVoucher(input: VoucherInput) {
  return prisma.$transaction(async (tx) => {
    const voucher = await tx.voucher.create({ data: voucherData(input) });
    await syncCompatibility(tx, voucher.id, input.compatibleVoucherIds);
    await syncScope(tx, voucher.id, input);
    return voucher;
  });
}

export async function updateVoucher(id: string, input: VoucherInput) {
  return prisma.$transaction(async (tx) => {
    const voucher = await tx.voucher.update({
      where: { id },
      data: voucherData(input),
    });
    // Matriks lama diganti utuh supaya form jadi satu-satunya sumber kebenaran.
    await tx.voucherCompatibility.deleteMany({
      where: { OR: [{ voucherAId: id }, { voucherBId: id }] },
    });
    await syncCompatibility(tx, id, input.compatibleVoucherIds);
    await syncScope(tx, id, input);
    return voucher;
  });
}

export async function deleteVoucher(id: string) {
  await prisma.voucher.delete({ where: { id } });
}
