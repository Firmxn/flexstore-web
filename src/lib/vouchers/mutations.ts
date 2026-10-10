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

export async function createVoucher(input: VoucherInput) {
  return prisma.$transaction(async (tx) => {
    const voucher = await tx.voucher.create({ data: voucherData(input) });
    await syncCompatibility(tx, voucher.id, input.compatibleVoucherIds);
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
    return voucher;
  });
}

export async function deleteVoucher(id: string) {
  await prisma.voucher.delete({ where: { id } });
}
