import { notFound } from "next/navigation";
import { z } from "zod";
import { BackLink } from "@/components/layout/BackLink";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { getBrands } from "@/lib/brands";
import { getCategories } from "@/lib/categories";
import { getProductById } from "@/lib/products";

const idSchema = z.string().uuid();

// `params` dan data produk dibaca di level halaman, di luar Suspense.
// `instant = false` menandai rute ini sebagai blocking route (Next.js 16
// cacheComponents); konfigurasi di layout tidak diwariskan ke halaman.
export const instant = false;

export default async function EditProductPage({
  params,
}: PageProps<"/admin/products/[id]/edit">) {
  const { id } = await params;
  if (!idSchema.safeParse(id).success) notFound();

  const [product, categories, brands] = await Promise.all([
    getProductById(id),
    getCategories(),
    getBrands(),
  ]);

  if (!product) notFound();

  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/admin/products">Kembali ke produk</BackLink>

      <PageHeader
        title="Ubah Produk"
        description={`Slug: ${product.slug}`}
      />

      <ProductForm
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name,
        }))}
        brands={brands.map((brand) => ({ id: brand.id, name: brand.name }))}
        initial={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description ?? "",
          categoryId: product.categoryId,
          brandId: product.brandId ?? "",
          status: product.status,
          images: product.images
            .filter((image) => image.role === "GALLERY")
            .map((image) => image.url),
          infoUrl: product.images.find((image) => image.role === "INFO")?.url ?? "",
          infoLabel: product.infoLabel ?? "",
          videoHeroUrl: product.videoHeroUrl ?? "",
          videoHeroAutoplay: product.videoHeroAutoplay,
          heroImageUrl: product.heroImageUrl ?? "",
          storyText: product.storyText ?? "",
          storyImageUrl:
            product.images.find((image) => image.role === "STORY")?.url ?? "",
          lookbookUrls: product.images
            .filter((image) => image.role === "LOOKBOOK")
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((image) => image.url),
          variants: product.variants.map((variant) => ({
            sku: variant.sku,
            name: variant.name,
            price: variant.price.toString(),
            stock: String(variant.stock),
            weightGram: String(variant.weightGram),
            imageUrl: variant.imageUrl ?? "",
          })),
        }}
      />
    </div>
  );
}
