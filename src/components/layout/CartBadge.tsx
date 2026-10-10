import Link from "next/link";
import { connection } from "next/server";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getCartAccess, getCartItemCount } from "@/lib/cart";

// Komponen async di dalam Suspense (Header): jumlah item dibaca per request
// dari Redis/Postgres, lalu di-stream ke shell halaman yang sudah terprerender.
export async function CartBadge() {
  // Identitas keranjang dibaca dari cookie/sesi, dan NextAuth memakai
  // crypto.getRandomValues() di dalamnya. connection() menandai bagian ini
  // sebagai dynamic supaya tidak ikut diprerender (Next.js 16 cacheComponents),
  // sama seperti HeaderUserMenu.
  await connection();

  // Role non-customer (mis. admin) tidak berbelanja: badge disembunyikan.
  const access = await getCartAccess();
  if (!access.ok) return null;

  const count = await getCartItemCount(access.identity);

  return (
    <Link
      href="/cart"
      className="inline-flex h-9 items-center gap-2 rounded-md border border-input px-3 text-sm hover:bg-accent"
    >
      <ShoppingCart className="h-4 w-4" />
      <span className="hidden sm:inline">Keranjang</span>
      {count > 0 ? <Badge variant="secondary">{count}</Badge> : null}
    </Link>
  );
}
