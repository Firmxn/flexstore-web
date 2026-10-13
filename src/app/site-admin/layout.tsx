import Link from "next/link";
import { SiteAdminSidebar } from "@/components/layout/SiteAdminSidebar";
import { SidebarAccountMenu } from "@/components/layout/SidebarAccountMenu";
import { requireSiteAdminPage } from "@/lib/auth/session";
import { getBrandSetting } from "@/lib/brand";
import { connection } from "next/server";

// SITE-00 (PH-08): area konfigurasi platform, terpisah dari /admin (Store
// Admin) sesuai PRD 2.4. Bergantung pada session, jadi tidak diprerender.
export const instant = false;

export default async function SiteAdminLayout({
  children,
}: LayoutProps<"/site-admin">) {
  // Proteksi berlapis: proxy menahan request, dan layout ini memastikan role
  // SITE_ADMIN sebelum halaman dirender (OWASP A01).
  // `connection()`: area site-admin selalu dibaca request-time (sesi +
  // kedaluwarsa di NextAuth memakai `new Date()` — gak sah di-prerender).
  await connection();
  const user = await requireSiteAdminPage();
  // SITE-05 (PH-09): nama brand dari pengaturan Site Admin.
  const brand = await getBrandSetting();

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-border bg-background lg:sticky lg:top-0 lg:z-10 lg:h-screen lg:w-60 lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center gap-2 border-b border-border px-4">
          <Link href="/" className="font-bold tracking-tight">
            {brand.brandName}
          </Link>
          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
            Platform
          </span>
        </div>

        <SiteAdminSidebar />

        <div className="mt-auto border-t border-border p-2">
          <SidebarAccountMenu name={user.name ?? "Site Admin"} role="Site Admin" />
        </div>
      </aside>

      <main className="flex-1 bg-muted/20 p-4 lg:p-8">{children}</main>
    </div>
  );
}
