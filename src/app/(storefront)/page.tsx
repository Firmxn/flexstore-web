import { Suspense } from "react";
import Link from "next/link";
import { ProductGrid } from "@/components/products/ProductGrid";
import { getPublishedProducts } from "@/lib/products";

async function FeaturedProducts() {
  const { products } = await getPublishedProducts({
    page: 1,
    limit: 8,
    search: undefined,
  });

  return <ProductGrid products={products} />;
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-72 animate-pulse rounded-xl border border-border bg-muted/40"
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12">
      <section className="rounded-2xl border border-border bg-muted/30 px-6 py-14 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Selamat datang di FlexStore
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Belanja produk pilihan dengan pengiriman ke seluruh Indonesia.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex h-11 items-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Lihat Semua Produk
        </Link>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Produk Terbaru</h2>
          <Link
            href="/products"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Lihat semua
          </Link>
        </div>

        <Suspense fallback={<ProductGridSkeleton />}>
          <FeaturedProducts />
        </Suspense>
      </section>
    </div>
  );
}
