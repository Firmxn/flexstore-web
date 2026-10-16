import { cookies } from "next/headers";
import { AppShell } from "@/components/layout/AppShell";
import {
  isSidebarCollapsed,
  SIDEBAR_PREF_COOKIE,
} from "@/lib/layout/sidebar-pref";
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

  // Preferensi sidebar (ringkas/penuh) dibaca lewat cookie pada request
  // pertama supaya tidak ada pergeseran layout setelah hydration. Cookie
  // sama dengan area admin, jadi keputusan user berlaku untuk keduanya.
  const cookieStore = await cookies();
  const initialCollapsed = isSidebarCollapsed(
    cookieStore.get(SIDEBAR_PREF_COOKIE)?.value,
  );

  return (
    <AppShell
      brandName={brand.brandName}
      userName={user.name ?? "Site Admin"}
      role="Site Admin"
      badge="Platform"
      variant="site-admin"
      initialCollapsed={initialCollapsed}
    >
      {children}
    </AppShell>
  );
}
