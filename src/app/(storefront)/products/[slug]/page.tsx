import { cache } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getPublishedProductBySlug } from "@/lib/products";
import { formatRupiah } from "@/lib/utils/format";

type DetailProps = PageProps<"/products/[slug]">;

// generateMetadata dan halaman sama-sama butuh produk yang sama. React `cache`
// membuat keduanya berbagi satu query per request.
const getProduct = cache(getPublishedProductBySlug);

// Slug dicek di level halaman, sebelum boundary Suspense mana pun, supaya UI
// not-found dirender dan slug tidak terindeks.
//
// Batasnya: `notFound()` hanya menghasilkan status HTTP 404 kalau dipanggil
// SEBELUM respons mulai streaming. Dengan `cacheComponents: true` rute ini tetap
// PPR - shell di-prerender dan dikirim lebih dulu dengan status 200 - sehingga di
// mode produksi statusnya tetap 200 dan Next.js hanya menitipkan
// <meta name="robots" content="noindex">. Perilaku ini memang terdokumentasi
// (docs Next.js, loading.mdx bagian "Status codes"). Sudah diuji: penanda build
// tetap PPR dan status produksi tetap 200.
//
// `instant = false` diperlukan agar akses `params` (runtime data) di luar Suspense
// tidak ditolak validasi instant-navigation. Ia TIDAK membuat rute ini blocking
// secara HTTP.
export const instant = false;

export async function generateMetadata({
  params,
}: DetailProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return { title: "Produk tidak ditemukan" };

  return {
    title: product.name,
    description:
      product.description?.slice(0, 160) ?? `Beli ${product.name} di FlexStore.`,
  };
}

export default async function ProductDetailPage({ params }: DetailProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
      <nav className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Beranda
        </Link>
        <span className="px-2">/</span>
        <Link href="/products" className="hover:text-foreground">
          Produk
        </Link>
        <span className="px-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          {product.images.length > 0 ? (
            <>
              <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              {product.images.length > 1 ? (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.slice(1).map((image) => (
                    <div
                      key={image.id}
                      className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
                    >
                      <Image
                        src={image.url}
                        alt={product.name}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
              Tanpa gambar
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              {product.category.name}
              {product.brand ? ` - ${product.brand.name}` : ""}
            </p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {product.totalStock > 0 ? (
              <Badge variant="secondary">
                Stok tersedia {product.totalStock}
              </Badge>
            ) : (
              <Badge variant="destructive">Stok habis</Badge>
            )}
          </div>

          {product.description ? (
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          ) : null}

          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Pilihan Varian
            </h2>
            <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
              {product.variants.map((variant) => (
                <li
                  key={variant.id}
                  className="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{variant.name}</span>
                    <span className="text-xs text-muted-foreground">
                      SKU {variant.sku}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold">
                      {formatRupiah(variant.price.toString())}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Stok {variant.stock}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
