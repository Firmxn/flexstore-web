import { cache } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/badge";
import { AddToCartForm } from "@/components/cart/AddToCartForm";
import { getPublishedProductBySlug } from "@/lib/products";

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

  // Bagan ukuran punya peran sendiri dan dipisahkan dari galeri (PRD 3.1.A).
  const gallery = product.images.filter((image) => image.role !== "SIZE_CHART");
  const sizeChart = product.images.find((image) => image.role === "SIZE_CHART");

  return (
    <PageContainer>
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
          {gallery.length > 0 ? (
            <>
              <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
                <Image
                  src={gallery[0].url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              {gallery.length > 1 ? (
                <div className="grid grid-cols-4 gap-3">
                  {gallery.slice(1).map((image) => (
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

          <AddToCartForm
            variants={product.variants.map((variant) => ({
              id: variant.id,
              name: variant.name,
              sku: variant.sku,
              price: Number(variant.price),
              stock: variant.stock,
            }))}
          />
        </div>
      </div>

      {sizeChart ? (
        <section className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4">
          <h2 className="font-semibold">Bagan Ukuran</h2>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-muted sm:aspect-[16/9]">
            <Image
              src={sizeChart.url}
              alt={`Bagan ukuran ${product.name}`}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-contain"
            />
          </div>
        </section>
      ) : null}
    </PageContainer>
  );
}
