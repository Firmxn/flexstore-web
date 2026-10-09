import { prisma } from "@/lib/db/prisma";

export function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export function getCategoryById(id: string) {
  return prisma.category.findUnique({ where: { id } });
}
