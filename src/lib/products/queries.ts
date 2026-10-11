import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import type { ProductListQuery, ProductSort } from "./validation";

const productInclude = {
  category: true,
  brand: true,
  images: { orderBy: { sortOrder: "asc" as const } },
  variants: { orderBy: { createdAt: "asc" as const } },
};

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

// Query daftar produk. `categorySlug`, `minPrice`, `maxPrice`, dan `sort` hanya
// dipakai storefront (filter katalog, PRD 3.1.A); admin memakai schema
// `productListQuerySchema` tanpa field-field ini.
export type ProductQuery = ProductListQuery & {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSort;
};

// Urutan katalog. Harga mengacu ke `Product.minPrice` (harga varian termurah,
// denormalisasi) karena Prisma tidak mendukung orderBy agregat relasi. `id`
// dipakai sebagai pemecah seri supaya paginasi stabil saat harga/nama sama.
const productOrderBy: Record<ProductSort, Prisma.ProductOrderByWithRelationInput[]> =
  {
    newest: [{ createdAt: "desc" }, { id: "asc" }],
    "price-asc": [{ minPrice: "asc" }, { id: "asc" }],
    "price-desc": [{ minPrice: "desc" }, { id: "asc" }],
    "name-asc": [{ name: "asc" }, { id: "asc" }],
  };

export async function getProducts(query: ProductQuery) {
  const { page, limit, status, search, categorySlug, minPrice, maxPrice, sort } =
    query;

  const where: Prisma.ProductWhereInput = {};
  if (status) where.status = status;
  if (categorySlug) where.category = { slug: categorySlug };
  if (minPrice !== undefined || maxPrice !== undefined) {
    // Produk cocok bila punya minimal satu varian di dalam rentang harga.
    where.variants = {
      some: {
        price: {
          ...(minPrice !== undefined ? { gte: minPrice } : {}),
          ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
        },
      },
    };
  }
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
      orderBy: productOrderBy[sort ?? "newest"],
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
export async function getPublishedProducts(query: ProductQuery) {
  return getProducts({ ...query, status: "ACTIVE" });
}

export function getPublishedProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, status: "ACTIVE" },
    include: productInclude,
  });
}
