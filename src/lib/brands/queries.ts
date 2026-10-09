import { prisma } from "@/lib/db/prisma";

export function getBrands() {
  return prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export function getBrandById(id: string) {
  return prisma.brand.findUnique({ where: { id } });
}
