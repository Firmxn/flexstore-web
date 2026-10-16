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

  // Ikon keranjang + badge jumlah saja (tanpa teks), gaya meniru lonceng
  // notifikasi di sebelahnya: tombol kotak 9x9 dan badge melayang di
  // kanan-atas ikon.
  return (
    <Link
      href="/cart"
      aria-label={count > 0 ? `Keranjang, ${count} item` : "Keranjang"}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-input hover:bg-accent"
    >
      <ShoppingCart className="h-4 w-4" aria-hidden />
      {count > 0 ? (
        <Badge
          variant="destructive"
          className="absolute -right-1.5 -top-1.5 h-5 min-w-5 justify-center px-1 text-[10px]"
        >
          {count > 99 ? "99+" : count}
        </Badge>
      ) : null}
    </Link>
  );
}
