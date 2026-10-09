import { Suspense } from "react";
import { Pagination } from "@/components/products/Pagination";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Input } from "@/components/ui/input";
import { getPublishedProducts } from "@/lib/products";

const PAGE_SIZE = 12;

function parsePage(value: string | string[] | undefined): number {
  if (typeof value !== "string") return 1;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function readSearch(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value.slice(0, 200) : undefined;
}

// searchParams adalah URL data, jadi harus diakses di dalam Suspense boundary
// (Next.js 16 cacheComponents). Isi halaman ada di komponen ini.
async function ProductsContent({
  searchParams,
}: {
  searchParams: PageProps<"/products">["searchParams"];
}) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const search = readSearch(params.search);

  const { products, total } = await getPublishedProducts({
    page,
    limit: PAGE_SIZE,
    search,
  });

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Katalog Produk</h1>

        <form action="/products" className="flex w-full gap-2 sm:w-auto">
          <Input
            name="search"
            placeholder="Cari produk..."
            defaultValue={search ?? ""}
            maxLength={200}
            className="sm:w-64"
          />
          <button
            type="submit"
            className="inline-flex h-10 shrink-0 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Cari
          </button>
        </form>
      </div>

      <p className="text-sm text-muted-foreground">{total} produk ditemukan</p>

      <ProductGrid products={products} />

      <Pagination
        page={page}
        limit={PAGE_SIZE}
        total={total}
        buildHref={(nextPage) => {
          const query = new URLSearchParams({ page: String(nextPage) });
          if (search) query.set("search", search);
          return `/products?${query.toString()}`;
        }}
      />
    </>
  );
}

function ProductsSkeleton() {
  return (
    <>
      <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-72 animate-pulse rounded-xl border border-border bg-muted/40"
          />
        ))}
      </div>
    </>
  );
}

export default function ProductsPage({ searchParams }: PageProps<"/products">) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10">
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
