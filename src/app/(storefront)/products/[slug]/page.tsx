import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/badge";
import { ProductShowcase } from "@/components/products/ProductShowcase";
import { EditorialSections } from "@/components/products/EditorialSections";
import { getBrandSetting } from "@/lib/brand";
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
  const [product, brand] = await Promise.all([
    getProduct(slug),
    getBrandSetting(),
  ]);

  if (!product) return { title: "Produk tidak ditemukan" };

  return {
    title: product.name,
    description:
      product.description?.slice(0, 160) ??
      `Beli ${product.name} di ${brand.brandName}.`,
  };
}

export default async function ProductDetailPage({ params }: DetailProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  // Bagan ukuran punya peran sendiri dan dipisahkan dari galeri (PRD 3.1.A).
  // PROD-07: STORY/LOOKBOOK juga di luar galeri — hanya GALLERY yang masuk carousel.
  const gallery = product.images.filter((image) => image.role === "GALLERY");
  const sizeChart = product.images.find((image) => image.role === "SIZE_CHART");
  const storyImage = product.images.find((image) => image.role === "STORY");
  const lookbookUrls = product.images
    .filter((image) => image.role === "LOOKBOOK")
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((image) => image.url);

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

      <ProductShowcase
        productName={product.name}
        gallery={gallery.map((image) => ({ id: image.id, url: image.url }))}
        variantMedia={product.variants.map((variant) => ({
          variantId: variant.id,
          variantName: variant.name,
          imageUrl: variant.imageUrl,
        }))}
        variants={product.variants.map((variant) => ({
          id: variant.id,
          name: variant.name,
          sku: variant.sku,
          price: Number(variant.price),
          stock: variant.stock,
        }))}
        sizeChartUrl={sizeChart?.url ?? null}
      >
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
      </ProductShowcase>

      <EditorialSections
        videoHeroUrl={product.videoHeroUrl}
        videoHeroAutoplay={product.videoHeroAutoplay}
        heroImageUrl={product.heroImageUrl}
        storyText={product.storyText}
        storyImageUrl={storyImage?.url ?? null}
        lookbookUrls={lookbookUrls}
        productName={product.name}
        description={product.description}
      />
    </PageContainer>
  );
}
