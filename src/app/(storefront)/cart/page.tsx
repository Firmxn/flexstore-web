import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { PageContainer } from "@/components/layout/PageContainer";
import { CartView } from "@/components/cart/CartView";
import { homeForRole } from "@/lib/auth/session";
import { getCart, getCartAccess } from "@/lib/cart";

export const metadata = { title: "Keranjang" };

// Halaman ini membaca cookie/sesi dan data per pengguna, jadi tidak ada
// gunanya diprerender. `instant = false` mencegah galat validasi
// instant-navigation karena data dinamis diakses di luar Suspense.
export const instant = false;

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<{ hilite?: string | string[] | undefined }>;
}) {
  // Halaman membaca cookie/sesi (NextAuth memakai crypto.getRandomValues()),
  // jadi ditandai request-time supaya tidak diprerender (Next.js 16
  // cacheComponents). Lihat docs/messages/blocking-prerender-crypto.
  await connection();

  // CART-05 (TASK-114): `?hilite=<variantId>` dari tombol kartu "Keranjang"
  // saat semua stok varian itu sudah di keranjang — dipakai untuk highlight.
  const params = await searchParams;
  const hilite =
    typeof params.hilite === "string" && params.hilite.trim() !== ""
      ? params.hilite
      : undefined;

  // Keranjang hanya untuk customer dan guest; role lain (mis. admin)
  // diarahkan ke areanya masing-masing (PRD 2).
  const access = await getCartAccess();
  if (!access.ok) redirect(homeForRole(access.role));

  const cart = access.identity
    ? await getCart(access.identity)
    : { items: [], subtotal: 0, itemCount: 0 };

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold tracking-tight">Keranjang</h1>

      {cart.items.length === 0 ? (
        <div className="flex flex-col items-start gap-4 rounded-xl border border-dashed border-border p-8">
          <p className="text-sm text-muted-foreground">
            Keranjang masih kosong. Pilih produk dulu, lalu kembalikan ke sini
            untuk checkout.
          </p>
          <Link
            href="/products"
            className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Lihat produk
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Centang item yang ingin di-checkout. Item yang tidak dicentang
            tetap tersimpan di keranjang.
          </p>
          <CartView items={cart.items} hilite={hilite} />
        </>
      )}
    </PageContainer>
  );
}
