import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProductGrid } from "@/components/products/ProductGrid";
import {
  DEFAULT_BANNER_BUTTON_HREF,
  DEFAULT_BANNER_BUTTON_LABEL,
  DEFAULT_BANNER_TEXT,
  defaultBannerTitle,
  getBrandSetting,
} from "@/lib/brand";
import { getCartAccess, getCartQuantities } from "@/lib/cart";
import { getPublishedProducts } from "@/lib/products";
import { cn } from "@/lib/utils/cn";

async function FeaturedProducts() {
  // Membaca cookie/sesi (getCartAccess) untuk menentukan tombol tampil, jadi
  // request-time.
  await connection();

  const [{ products }, access] = await Promise.all([
    getPublishedProducts({
      page: 1,
      limit: 8,
      search: undefined,
    }),
    getCartAccess(),
  ]);

  // Kuantitas keranjang untuk stok efektif kartu (CART-05, TASK-114).
  const cartQuantities =
    access.ok && access.identity ? await getCartQuantities(access.identity) : {};

  return (
    <ProductGrid
      products={products}
      canShop={access.ok}
      cartQuantities={cartQuantities}
    />
  );
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

export default async function HomePage() {
  // SITE-05 (PH-09): hero/banner mengikuti identitas brand. Banner hanya
  // menggantikan hero saat sakelar aktif; kolom yang kosong jatuh ke teks
  // bawaan.
  const brand = await getBrandSetting();
  const banner = brand.banner;
  const title = banner.title ?? defaultBannerTitle(brand.brandName);
  const text = banner.text ?? DEFAULT_BANNER_TEXT;
  const buttonLabel = banner.buttonLabel ?? DEFAULT_BANNER_BUTTON_LABEL;
  const buttonHref = banner.buttonHref ?? DEFAULT_BANNER_BUTTON_HREF;
  const imageUrl = banner.enabled ? banner.imageUrl : null;

  return (
    <>
      {/* Hero banner: lebar penuh layar (full-width), di luar PageContainer. */}
      <section
        className={cn(
          "relative overflow-hidden",
          !imageUrl && "bg-muted/30",
        )}
      >
        {imageUrl ? (
          // URL berasal dari Uploadthing; pakai img biasa agar tidak bergantung
          // pada allowlist domain next/image.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}

        <div
          className={cn(
            "relative px-6 py-14 text-center",
            imageUrl && "bg-black/50",
          )}
        >
          <h1
            className={cn(
              "text-3xl font-bold tracking-tight sm:text-4xl",
              imageUrl && "text-white",
            )}
          >
            {title}
          </h1>
          <p
            className={cn(
              "mx-auto mt-4 max-w-2xl",
              imageUrl ? "text-white/90" : "text-muted-foreground",
            )}
          >
            {text}
          </p>
          <Link
            href={buttonHref}
            className="mt-8 inline-flex h-11 items-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {buttonLabel}
          </Link>
        </div>
      </section>

      {/* Konten storefront tetap di dalam container terpusat. */}
      <PageContainer>
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
      </PageContainer>
    </>
  );
}
