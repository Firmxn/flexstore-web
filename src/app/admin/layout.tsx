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
      {/* Sidebar memakai `lg:fixed`, BUKAN `lg:sticky`. Penyebabnya Radix
          Select/Dialog saat popup terbuka menandai body `data-scroll-locked`
          + `overflow: hidden`, yang mengganti scroll container terdekat bagi
          elemen sticky — sticky berhenti menempel dan ikut tergulung (bug
          "sidebar belakang" saat dropdown pilih template dibuka di
          AdminOrderActions). `fixed` tidak terpengaruh overflow body. Konten
          main dikompensasi dengan `lg:pl-60` (lebar sidebar 15rem). */}
      <aside className="border-b border-border bg-background lg:fixed lg:inset-y-0 lg:left-0 lg:z-10 lg:w-60 lg:overflow-y-auto lg:border-b-0 lg:border-r">
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

      <main className="flex-1 bg-muted/20 p-4 lg:p-8 lg:pl-[17rem]">
        {children}
      </main>
    </div>
  );
}
