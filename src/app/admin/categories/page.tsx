import { PageHeader } from "@/components/admin/PageHeader";
import { TaxonomyManager } from "@/components/admin/TaxonomyManager";
import { getCategories } from "@/lib/categories";

// Data kategori diambil di level halaman, di luar Suspense. `instant = false`
// menandai rute ini sebagai blocking route (Next.js 16 cacheComponents) supaya
// data dinamis diizinkan; konfigurasi di layout tidak diwariskan ke halaman.
export const instant = false;

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Kategori"
        description="Kategori dipakai untuk mengelompokkan produk di storefront."
      />

      <TaxonomyManager
        resource="categories"
        singularLabel="Kategori"
        initialItems={categories.map((category) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          productCount: category._count.products,
        }))}
      />
    </div>
  );
}
