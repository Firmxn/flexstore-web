import { ProductCard } from "./ProductCard";
import type { ProductWithRelations } from "@/lib/products/queries";

export function ProductGrid({
  products,
  canShop,
}: {
  products: ProductWithRelations[];
  canShop: boolean;
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
        Belum ada produk yang tersedia.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} canShop={canShop} />
      ))}
    </div>
  );
}
