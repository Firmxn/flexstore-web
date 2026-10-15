import { Suspense } from "react";
import { connection } from "next/server";
import { PageContainer } from "@/components/layout/PageContainer";
import { CatalogFilters } from "@/components/products/CatalogFilters";
import { CategoryPills } from "@/components/products/CategoryPills";
import { Pagination } from "@/components/products/Pagination";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Input } from "@/components/ui/input";
import { getCartAccess, getCartQuantities } from "@/lib/cart";
import { getCategories } from "@/lib/categories";
import { getPublishedProducts } from "@/lib/products";
import { catalogFilterSchema } from "@/lib/products/validation";

const PAGE_SIZE = 12;

function parsePage(value: string | string[] | undefined): number {
  if (typeof value !== "string") return 1;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

// searchParams bisa berupa array; ambil nilai tunggal non-kosong saja.
function firstString(value: string | string[] | undefined): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

// searchParams adalah URL data, jadi harus diakses di dalam Suspense boundary
// (Next.js 16 cacheComponents). Isi halaman ada di komponen ini.
async function ProductsContent({
  searchParams,
}: {
  searchParams: PageProps<"/products">["searchParams"];
}) {
  // Membaca cookie/sesi (getCartAccess) + searchParams, jadi request-time.
  await connection();

  const params = await searchParams;
  const page = parsePage(params.page);
  const filters = catalogFilterSchema.parse({
    search: firstString(params.search),
    category: firstString(params.category),
    minPrice: firstString(params.minPrice),
    maxPrice: firstString(params.maxPrice),
    sort: firstString(params.sort),
  });

  const [{ products, total }, categories, access] = await Promise.all([
    getPublishedProducts({
      page,
      limit: PAGE_SIZE,
      search: filters.search,
      categorySlug: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sort: filters.sort,
    }),
    getCategories(),
    getCartAccess(),
  ]);

  // Query yang harus dipertahankan saat berpindah kategori / halaman.
  const preserve: Record<string, string | undefined> = {
    search: filters.search,
    minPrice: filters.minPrice !== undefined ? String(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice !== undefined ? String(filters.maxPrice) : undefined,
    sort: filters.sort !== "newest" ? filters.sort : undefined,
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Katalog Produk</h1>

        <form action="/products" className="flex w-full gap-2 sm:w-auto">
          {filters.category ? (
            <input type="hidden" name="category" value={filters.category} />
          ) : null}
          {preserve.minPrice ? (
            <input type="hidden" name="minPrice" value={preserve.minPrice} />
          ) : null}
          {preserve.maxPrice ? (
            <input type="hidden" name="maxPrice" value={preserve.maxPrice} />
          ) : null}
          {preserve.sort ? (
            <input type="hidden" name="sort" value={preserve.sort} />
          ) : null}
          <Input
            name="search"
            placeholder="Cari produk..."
            defaultValue={filters.search ?? ""}
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

      <CategoryPills
        categories={categories}
        activeSlug={filters.category ?? null}
        preserve={preserve}
      />

      <CatalogFilters
        search={filters.search}
        category={filters.category}
        minPrice={preserve.minPrice}
        maxPrice={preserve.maxPrice}
        sort={filters.sort}
      />

      <ProductGrid
        products={products}
        canShop={access.ok}
        cartQuantities={
          access.ok && access.identity
            ? await getCartQuantities(access.identity)
            : {}
        }
      />

      <Pagination
        page={page}
        limit={PAGE_SIZE}
        total={total}
        buildHref={(nextPage) => {
          const query = new URLSearchParams({ page: String(nextPage) });
          if (filters.search) query.set("search", filters.search);
          if (filters.category) query.set("category", filters.category);
          if (preserve.minPrice) query.set("minPrice", preserve.minPrice);
          if (preserve.maxPrice) query.set("maxPrice", preserve.maxPrice);
          if (preserve.sort) query.set("sort", preserve.sort);
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
    <PageContainer>
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsContent searchParams={searchParams} />
      </Suspense>
    </PageContainer>
  );
}
