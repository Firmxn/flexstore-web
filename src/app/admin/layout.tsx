import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarAccountMenu } from "@/components/layout/SidebarAccountMenu";
import { requireStoreAdminPage } from "@/lib/auth/session";
import { getBrandSetting } from "@/lib/brand";

// Seluruh area admin bergantung pada session, jadi tidak ada gunanya
// diprerender. `instant = false` menandai route ini sebagai blocking route
// (Next.js 16 cacheComponents) sehingga tidak ada data dinamis di luar Suspense.
export const instant = false;

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Proteksi berlapis: proxy menahan request, dan layout ini memastikan role
  // STORE_ADMIN sebelum halaman admin dirender (OWASP A01).
  const user = await requireStoreAdminPage();
  // SITE-05 (PH-09): nama brand dari pengaturan Site Admin.
  const brand = await getBrandSetting();

  return (
    // `flex-1` (bukan `min-h-full`): `<body>` root layout hanya punya
    // `min-height`, sehingga persentase tinggi tidak dapat dihitung.
    <div className="flex flex-1 flex-col lg:flex-row">
      {/* `lg:sticky lg:top-0 lg:h-screen` + `overflow-y-auto`: tanpa ini,
          tinggi aside mengikuti tinggi baris (yakni setinggi konten main yang
          bisa jauh melebihi layar), sehingga header dan bar keluar ikut
          tergulung keluar layar saat admin mengisi form panjang. */}
      <aside className="flex shrink-0 flex-col border-b border-border bg-background lg:sticky lg:top-0 lg:z-10 lg:h-screen lg:w-60 lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center gap-2 border-b border-border px-4">
          <Link href="/" className="font-bold tracking-tight">
            {brand.brandName}
          </Link>
          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
            Admin
          </span>
        </div>

        <Sidebar />

        <div className="mt-auto border-t border-border p-2">
          <SidebarAccountMenu name={user.name ?? "Admin"} role="Store Admin" />
        </div>
      </aside>

      <main className="flex-1 bg-muted/20 p-4 lg:p-8">{children}</main>
    </div>
  );
}
