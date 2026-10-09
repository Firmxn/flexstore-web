import { notFound } from "next/navigation";
import { z } from "zod";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { getBrands } from "@/lib/brands";
import { getCategories } from "@/lib/categories";
import { getProductById } from "@/lib/products";

const idSchema = z.string().uuid();

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
          images: product.images.map((image) => image.url),
          variants: product.variants.map((variant) => ({
            sku: variant.sku,
            name: variant.name,
            price: variant.price.toString(),
            stock: String(variant.stock),
          })),
        }}
      />
    </div>
  );
}
