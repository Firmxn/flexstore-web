import { prisma } from "@/lib/db/prisma";

export type VoucherListParams = {
  page: number;
  limit: number;
  search?: string;
};

export async function getVouchers({ page, limit, search }: VoucherListParams) {
  const where = search
    ? { code: { contains: search.trim().toUpperCase() } }
    : {};

  const [vouchers, total] = await Promise.all([
    prisma.voucher.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { _count: { select: { usages: true } } },
    }),
    prisma.voucher.count({ where }),
  ]);

  return { vouchers, total, page, limit };
}

export async function getVoucherById(id: string) {
  return prisma.voucher.findUnique({
    where: { id },
    include: {
      compatibilitiesAsA: { select: { voucherBId: true, isAllowed: true } },
      compatibilitiesAsB: { select: { voucherAId: true, isAllowed: true } },
      products: { select: { productId: true, kind: true } },
      categories: { select: { categoryId: true } },
      _count: { select: { usages: true } },
    },
  });
}

// Pilihan voucher lain untuk matriks kompatibilitas di form admin.
export async function getVoucherOptions(excludeId?: string) {
  return prisma.voucher.findMany({
    where: excludeId ? { id: { not: excludeId } } : undefined,
    select: { id: true, code: true, type: true, isActive: true },
    orderBy: { code: "asc" },
  });
}

// Pilihan cakupan voucher (produk + kategori) untuk form admin (PRD 5.4).
export async function getVoucherScopeOptions() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
      take: 500,
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return { products, categories };
}
