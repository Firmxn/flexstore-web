import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import type { ProductListQuery } from "./validation";

const productInclude = {
  category: true,
  brand: true,
  images: { orderBy: { sortOrder: "asc" as const } },
  variants: { orderBy: { createdAt: "asc" as const } },
};

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

export async function getProducts(query: ProductListQuery) {
  const { page, limit, status, search } = query;

  const where: Prisma.ProductWhereInput = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, page, limit };
}

export function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
}

export function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: productInclude,
  });
}

// Hanya produk yang tampil di storefront.
export async function getPublishedProducts(query: ProductListQuery) {
  return getProducts({ ...query, status: "ACTIVE" });
}

export function getPublishedProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, status: "ACTIVE" },
    include: productInclude,
  });
}
