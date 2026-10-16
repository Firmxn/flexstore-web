import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { ProductWithRelations } from "@/lib/products/queries";
import { DEFAULT_INFO_LABEL } from "@/lib/products/validation";
import { ProductCardActions } from "./ProductCardActions";
import { WishlistButton } from "./WishlistButton";

export function ProductCard({
  product,
  canShop,
  cartQuantities = {},
}: {
  product: ProductWithRelations;
  canShop: boolean;
  // CART-05/TASK-114: kuantitas varian yang sudah di keranjang pembeli
  // (`Record<variantId, quantity>`), dibaca halaman sekali per render.
  cartQuantities?: Record<string, number>;
}) {
  // Informasi tambahan bukan foto produk; jangan dipakai sebagai sampul
  // (PRD 3.1.A, PROD-08).
  const cover = product.images.find((image) => image.role === "GALLERY")?.url;
  const hasInfo = product.images.some((image) => image.role === "INFO");
  const infoLabel = product.infoLabel ?? DEFAULT_INFO_LABEL;
  const prices = product.variants.map((variant) => Number(variant.price));
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  const href = `/products/${product.slug}`;

  return (
    <Card className="relative flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <Link href={href} className="block p-3">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
          {cover ? (
            <Image
              src={cover}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Tanpa gambar
            </div>
          )}
        </div>
      </Link>

      {/* Favorit dummy: di luar <Link> supaya tombol tidak bersarang di dalam
          tautan (HTML invalid + target klik bentrok). */}
      <WishlistButton productId={product.id} productName={product.name} />

      <div className="flex flex-1 flex-col gap-2 px-3 pb-3">
        <Link href={href} className="block">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          {/* Dummy rating — belum ada field rating pada produk, tampilan saja. */}
          <span className="text-sm text-amber-500">★ 4,5</span>
          <span className="text-muted-foreground">• Stok {totalStock}</span>
        </p>

        <div className="mt-auto pt-1">
          {/* Role non-pembeli (mis. admin) tetap melihat tombol, tapi disabled
              (keputusan pengguna 2026-10-16 — sebelumnya blok ini disembunyikan). */}
          <ProductCardActions
            canShop={canShop}
            productName={product.name}
            productHref={href}
            coverUrl={cover ?? null}
            hasInfo={hasInfo}
            infoLabel={infoLabel}
            price={minPrice}
            variants={product.variants.map((variant) => ({
              id: variant.id,
              name: variant.name,
              price: Number(variant.price),
              stock: variant.stock,
              keranjang: cartQuantities[variant.id] ?? 0,
            }))}
          />
        </div>
      </div>
    </Card>
  );
}
