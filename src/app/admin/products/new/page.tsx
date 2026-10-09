import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { getBrands } from "@/lib/brands";
import { getCategories } from "@/lib/categories";

// Data kategori dan brand diambil di level halaman, di luar Suspense.
// `instant = false` menandai rute ini sebagai blocking route (Next.js 16
// cacheComponents); konfigurasi di layout tidak diwariskan ke halaman.
export const instant = false;

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([getCategories(), getBrands()]);

  const hasCategory = categories.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Tambah Produk"
        description="Produk baru disimpan dengan minimal satu varian dan satu gambar."
      />

      {hasCategory ? (
        <ProductForm
          categories={categories.map((category) => ({
            id: category.id,
            name: category.name,
          }))}
          brands={brands.map((brand) => ({ id: brand.id, name: brand.name }))}
        />
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-background p-8 text-sm">
          <p className="font-medium">Kategori belum tersedia.</p>
          <p className="mt-1 text-muted-foreground">
            Buat minimal satu kategori sebelum menambah produk.
          </p>
          <Link
            href="/admin/categories"
            className="mt-4 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Kelola Kategori
          </Link>
        </div>
      )}
    </div>
  );
}
