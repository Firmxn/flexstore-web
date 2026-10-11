import { Suspense } from "react";
import Link from "next/link";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProductStatusFilterSelect } from "@/components/admin/ProductStatusFilterSelect";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getBrandSetting } from "@/lib/brand";
import { getProducts } from "@/lib/products";
import { PRODUCT_STATUSES } from "@/lib/products/validation";
import { PRODUCT_STATUS_LABELS, formatRupiah } from "@/lib/utils/format";

const PAGE_SIZE = 20;

// `searchParams` dan data produk dibaca di level halaman, di luar Suspense.
// `instant = false` menandai rute ini sebagai blocking route (Next.js 16
// cacheComponents); konfigurasi di layout tidak diwariskan ke halaman.
export const instant = false;

function parsePage(value: string | string[] | undefined): number {
  if (typeof value !== "string") return 1;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

const STATUS_BADGE = {
  ACTIVE: "success",
  INACTIVE: "secondary",
  DRAFT: "outline",
  OUT_OF_STOCK: "destructive",
  DISCONTINUED: "secondary",
} as const;

async function ProductTable({
  params,
}: {
  params: Record<string, string | string[] | undefined>;
}) {
  const page = parsePage(params.page);
  const search =
    typeof params.search === "string" ? params.search.slice(0, 200) : undefined;
  const status =
    typeof params.status === "string" &&
    (PRODUCT_STATUSES as readonly string[]).includes(params.status)
      ? (params.status as (typeof PRODUCT_STATUSES)[number])
      : undefined;

  const { products, total } = await getProducts({
    page,
    limit: PAGE_SIZE,
    status,
    search,
  });

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-background p-12 text-center text-sm text-muted-foreground">
        Belum ada produk yang cocok.
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produk</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Harga Mulai</TableHead>
            <TableHead>Stok</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const prices = product.variants.map((variant) =>
              Number(variant.price),
            );
            const minPrice = prices.length ? Math.min(...prices) : 0;

            return (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {product.slug}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{product.category.name}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_BADGE[product.status]}>
                    {PRODUCT_STATUS_LABELS[product.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {formatRupiah(minPrice)}
                </TableCell>
                <TableCell className="text-sm">{product.totalStock}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="inline-flex h-9 items-center rounded-md border border-input px-3 text-sm hover:bg-accent"
                    >
                      Ubah
                    </Link>
                    <DeleteButton
                      url={`/api/admin/products/${product.id}`}
                      confirmMessage={`Hapus produk "${product.name}"?`}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {total} produk - halaman {page} dari {totalPages}
        </span>
        <div className="flex gap-2">
          {page > 1 ? (
            <Link
              href={`/admin/products?page=${page - 1}`}
              className="inline-flex h-9 items-center rounded-md border border-input px-3 hover:bg-accent"
            >
              Sebelumnya
            </Link>
          ) : null}
          {page < totalPages ? (
            <Link
              href={`/admin/products?page=${page + 1}`}
              className="inline-flex h-9 items-center rounded-md border border-input px-3 hover:bg-accent"
            >
              Selanjutnya
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default async function AdminProductsPage({
  searchParams,
}: PageProps<"/admin/products">) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const status = typeof params.status === "string" ? params.status : "";
  // SITE-05 (PH-09): nama brand dari pengaturan Site Admin.
  const brand = await getBrandSetting();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Produk"
        description={`Kelola katalog produk ${brand.brandName}.`}
        action={
          <Link
            href="/admin/products/new"
            className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Tambah Produk
          </Link>
        }
      />

      <form
        action="/admin/products"
        className="flex flex-col gap-2 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-center"
      >
        <Input
          name="search"
          placeholder="Cari nama atau slug..."
          defaultValue={search}
          maxLength={200}
          className="sm:max-w-64"
        />
        <ProductStatusFilterSelect
          defaultValue={status}
          options={PRODUCT_STATUSES.map((value) => ({
            value,
            label: PRODUCT_STATUS_LABELS[value],
          }))}
        />
        <button
          type="submit"
          className="inline-flex h-10 shrink-0 items-center rounded-md border border-input px-4 text-sm hover:bg-accent"
        >
          Terapkan
        </button>
      </form>

      <Suspense
        fallback={<p className="text-sm text-muted-foreground">Memuat produk...</p>}
      >
        <ProductTable params={params} />
      </Suspense>
    </div>
  );
}
