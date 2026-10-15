import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { ProductWithRelations } from "@/lib/products/queries";
import { formatRupiah } from "@/lib/utils/format";
import { ProductCardActions } from "./ProductCardActions";

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
  // Bagan ukuran bukan foto produk; jangan dipakai sebagai sampul (PRD 3.1.A).
  const cover = product.images.find((image) => image.role === "GALLERY")?.url;
  const hasSizeChart = product.images.some((image) => image.role === "SIZE_CHART");
  const prices = product.variants.map((variant) => Number(variant.price));
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;
  const href = `/products/${product.slug}`;

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-md">
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

      <div className="flex flex-1 flex-col gap-2 px-3 pb-3">
        <Link href={href} className="block">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground">
          {minPrice === maxPrice
            ? formatRupiah(minPrice)
            : `${formatRupiah(minPrice)} - ${formatRupiah(maxPrice)}`}
        </p>

        {canShop ? (
          <div className="mt-auto pt-1">
            <ProductCardActions
              productName={product.name}
              productHref={href}
              coverUrl={cover ?? null}
              hasSizeChart={hasSizeChart}
              variants={product.variants.map((variant) => ({
                id: variant.id,
                name: variant.name,
                price: Number(variant.price),
                stock: variant.stock,
                keranjang: cartQuantities[variant.id] ?? 0,
              }))}
            />
          </div>
        ) : null}
      </div>
    </Card>
  );
}
