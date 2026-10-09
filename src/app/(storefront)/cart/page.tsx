import Link from "next/link";
import { connection } from "next/server";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";
import { getCart, getCartIdentity } from "@/lib/cart";
import { isShippingApiConfigured } from "@/lib/shipping";
import { formatRupiah } from "@/lib/utils/format";

export const metadata = { title: "Keranjang" };

// Halaman ini membaca cookie/sesi dan data per pengguna, jadi tidak ada
// gunanya diprerender. `instant = false` mencegah galat validasi
// instant-navigation karena data dinamis diakses di luar Suspense.
export const instant = false;

export default async function CartPage() {
  // Halaman membaca cookie/sesi (NextAuth memakai crypto.getRandomValues()),
  // jadi ditandai request-time supaya tidak diprerender (Next.js 16
  // cacheComponents). Lihat docs/messages/blocking-prerender-crypto.
  await connection();

  const identity = await getCartIdentity();
  const cart = identity
    ? await getCart(identity)
    : { items: [], subtotal: 0, itemCount: 0 };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Keranjang</h1>

      {cart.items.length === 0 ? (
        <div className="flex flex-col items-start gap-4 rounded-xl border border-dashed border-border p-8">
          <p className="text-sm text-muted-foreground">
            Keranjang masih kosong. Pilih produk dulu, lalu kembalikan ke sini
            untuk menghitung ongkos kirim.
          </p>
          <Link
            href="/products"
            className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Lihat produk
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <ul className="rounded-xl border border-border bg-background">
            {cart.items.map((item) => (
              <CartItemRow
                key={item.variantId}
                variantId={item.variantId}
                productName={item.productName}
                productSlug={item.productSlug}
                variantName={item.variantName}
                sku={item.sku}
                imageUrl={item.imageUrl}
                price={item.price}
                quantity={item.quantity}
                stock={item.stock}
                available={item.productStatus === "ACTIVE"}
              />
            ))}
          </ul>

          <CartSummary
            subtotal={cart.subtotal}
            itemCount={cart.itemCount}
            shippingConfigured={isShippingApiConfigured()}
          />
        </div>
      )}

      {cart.items.length > 0 ? (
        <p className="text-sm text-muted-foreground">
          Total sementara {formatRupiah(cart.subtotal)} sebelum ongkos kirim.
          Checkout dan pembuatan pesanan menyusul di PH-03.
        </p>
      ) : null}
    </div>
  );
}
