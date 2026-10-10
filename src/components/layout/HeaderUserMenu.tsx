import Link from "next/link";
import { connection } from "next/server";
import { HeaderAccountMenu } from "./HeaderAccountMenu";
import { getCurrentUser } from "@/lib/auth/session";

// Gaya nav link dipakai bersama oleh kedua cabang (tamu dan login) supaya
// tidak duplikasi string className.
const navLinkClass =
  "rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground";

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
        <Link href="/products" className={navLinkClass}>
          Produk
        </Link>
        <Link href="/track-order" className={navLinkClass}>
          Lacak
        </Link>
        <Link href="/login" className={navLinkClass}>
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
      <Link href="/products" className={navLinkClass}>
        Produk
      </Link>

      {/* Aksi akun (Pesanan, Panel admin, Keluar) hanya ada di menu akun,
          supaya tidak ada link ganda di navbar. */}
      <span aria-hidden className="mx-1 h-5 w-px bg-border" />

      <HeaderAccountMenu name={user.name ?? "Akun"} role={user.role} />
    </nav>
  );
}
