import Link from "next/link";
import { connection } from "next/server";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { getCurrentUser } from "@/lib/auth/session";

// Server Component terpisah supaya Header tetap statis dan bagian yang membaca
// session bisa di-stream di dalam Suspense boundary.
export async function HeaderUserMenu() {
  // Menu ini membaca session dari cookie, dan NextAuth memakai
  // crypto.getRandomValues() di dalamnya. connection() menandai bagian ini
  // sebagai dynamic supaya tidak ikut diprerender (Next.js 16 cacheComponents).
  await connection();

  const user = await getCurrentUser();

  if (!user) {
    return (
      <nav className="flex items-center gap-1 text-sm font-medium">
        <Link
          href="/products"
          className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          Produk
        </Link>
        <Link
          href="/track-order"
          className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          Lacak
        </Link>
        <Link
          href="/login"
          className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          Masuk
        </Link>
        <Link
          href="/register"
          className="rounded-md bg-primary px-3 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Daftar
        </Link>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-1 text-sm font-medium">
      <Link
        href="/products"
        className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        Produk
      </Link>
      <Link
        href="/orders"
        className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        Pesanan
      </Link>
      {user.role === "STORE_ADMIN" ? (
        <Link
          href="/admin/products"
          className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          Admin
        </Link>
      ) : null}
      <span className="hidden px-2 text-muted-foreground sm:inline">
        {user.name}
      </span>
      <LogoutButton />
    </nav>
  );
}
