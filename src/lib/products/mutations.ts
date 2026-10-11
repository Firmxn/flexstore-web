import { prisma } from "@/lib/db/prisma";
import type { ProductInput } from "./validation";

function calculateTotalStock(variants: { stock: number }[]) {
  return variants.reduce((sum, variant) => sum + variant.stock, 0);
}

// Harga varian termurah disimpan di Product supaya katalog bisa diurutkan
// berdasarkan harga (Prisma tidak mendukung orderBy agregat relasi).
function calculateMinPrice(variants: { price: number }[]) {
  if (variants.length === 0) return 0;
  return Math.min(...variants.map((variant) => variant.price));
}

function normalizeInput(input: ProductInput) {
  const galleryImages = input.images.map((image, index) => ({
    url: image.url,
    role: "GALLERY" as const,
    sortOrder: image.sortOrder ?? index,
  }));
  // Bagan ukuran disimpan sebagai baris gambar dengan peran SIZE_CHART
  // (PRD 3.1.A/7.4), terpisah dari galeri.
  const sizeChart = input.sizeChartUrl
    ? [{ url: input.sizeChartUrl, role: "SIZE_CHART" as const, sortOrder: 0 }]
    : [];

  return {
    name: input.name,
    slug: input.slug,
    description: input.description || null,
    status: input.status,
    categoryId: input.categoryId,
    brandId: input.brandId || null,
    totalStock: calculateTotalStock(input.variants),
    minPrice: calculateMinPrice(input.variants),
    images: {
      create: [...galleryImages, ...sizeChart],
    },
    variants: {
      create: input.variants.map((variant) => ({
        sku: variant.sku,
        name: variant.name,
        price: variant.price,
        stock: variant.stock,
        weightGram: variant.weightGram,
        imageUrl: variant.imageUrl || null,
      })),
    },
  };
}

export function createProduct(input: ProductInput) {
  return prisma.product.create({
    data: normalizeInput(input),
    include: { images: true, variants: true },
  });
}

// Gambar & variant diganti seluruhnya. Varian lama dihapus lalu dibuat ulang,
// sehingga ID varian berubah. OrderItem belum ada di PH-01, jadi belum ada
// data yang bergantung pada ID varian lama.
export function updateProduct(id: string, input: ProductInput) {
  const { images, variants, ...productFields } = normalizeInput(input);

  return prisma.$transaction(async (tx) => {
    await tx.productImage.deleteMany({ where: { productId: id } });
    await tx.productVariant.deleteMany({ where: { productId: id } });

    return tx.product.update({
      where: { id },
      data: {
        ...productFields,
        images,
        variants,
      },
      include: { images: true, variants: true },
    });
  });
}

export function deleteProduct(id: string) {
  // ProductImage & ProductVariant ikut terhapus (onDelete: Cascade).
  return prisma.product.delete({ where: { id } });
}
