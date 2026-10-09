import { PageHeader } from "@/components/admin/PageHeader";
import { TaxonomyManager } from "@/components/admin/TaxonomyManager";
import { getBrands } from "@/lib/brands";

// Data brand diambil di level halaman, di luar Suspense. `instant = false`
// menandai rute ini sebagai blocking route (Next.js 16 cacheComponents) supaya
// data dinamis diizinkan; konfigurasi di layout tidak diwariskan ke halaman.
export const instant = false;

export default async function AdminBrandsPage() {
  const brands = await getBrands();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Brand"
        description="Brand bersifat opsional pada produk."
      />

      <TaxonomyManager
        resource="brands"
        singularLabel="Brand"
        initialItems={brands.map((brand) => ({
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          productCount: brand._count.products,
        }))}
      />
    </div>
  );
}
