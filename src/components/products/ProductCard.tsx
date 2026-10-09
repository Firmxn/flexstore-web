import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ProductWithRelations } from "@/lib/products/queries";
import { formatRupiah } from "@/lib/utils/format";

export function ProductCard({ product }: { product: ProductWithRelations }) {
  const cover = product.images[0]?.url;
  const prices = product.variants.map((variant) => Number(variant.price));
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square bg-muted">
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

        <div className="flex flex-col gap-2 p-4">
          <p className="text-xs text-muted-foreground">{product.category.name}</p>
          <h3 className="line-clamp-2 font-medium leading-snug">{product.name}</h3>
          <p className="font-semibold">
            {minPrice === maxPrice
              ? formatRupiah(minPrice)
              : `${formatRupiah(minPrice)} - ${formatRupiah(maxPrice)}`}
          </p>

          <div className="flex items-center gap-2">
            {product.totalStock > 0 ? (
              <Badge variant="secondary">Stok {product.totalStock}</Badge>
            ) : (
              <Badge variant="destructive">Stok habis</Badge>
            )}
            {product.brand ? (
              <Badge variant="outline">{product.brand.name}</Badge>
            ) : null}
          </div>
        </div>
      </Link>
    </Card>
  );
}
