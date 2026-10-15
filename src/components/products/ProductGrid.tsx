import { ProductCard } from "./ProductCard";
import type { ProductWithRelations } from "@/lib/products/queries";

export function ProductGrid({
  products,
  canShop,
  cartQuantities = {},
}: {
  products: ProductWithRelations[];
  canShop: boolean;
  // CART-05/TASK-114: kuantitas keranjang per varian untuk stok efektif kartu.
  cartQuantities?: Record<string, number>;
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
        <ProductCard
          key={product.id}
          product={product}
          canShop={canShop}
          cartQuantities={cartQuantities}
        />
      ))}
    </div>
  );
}
