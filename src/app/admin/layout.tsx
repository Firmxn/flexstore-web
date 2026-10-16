import { cookies } from "next/headers";
import { AppShell } from "@/components/layout/AppShell";
import {
  isSidebarCollapsed,
  SIDEBAR_PREF_COOKIE,
} from "@/lib/layout/sidebar-pref";
import { requireStoreAdminPage } from "@/lib/auth/session";
import { getBrandSetting } from "@/lib/brand";
import { connection } from "next/server";

// Seluruh area admin bergantung pada session, jadi tidak ada gunanya
// diprerender. `instant = false` menandai route ini sebagai blocking route
// (Next.js 16 cacheComponents) sehingga tidak ada data dinamis di luar Suspense.
export const instant = false;

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Proteksi berlapis: proxy menahan request, dan layout ini memastikan role
  // STORE_ADMIN sebelum halaman admin dirender (OWASP A01).
  // `connection()`: area admin selalu dibaca request-time (sesi + kedaluwarsa
  // di NextAuth memakai `new Date()` — gak sah di-prerender).
  await connection();
  const user = await requireStoreAdminPage();
  // SITE-05 (PH-09): nama brand dari pengaturan Site Admin.
  const brand = await getBrandSetting();

  // Preferensi sidebar (ringkas/penuh) dibaca lewat cookie pada request
  // pertama supaya tidak ada pergeseran layout setelah hydration.
  const cookieStore = await cookies();
  const initialCollapsed = isSidebarCollapsed(
    cookieStore.get(SIDEBAR_PREF_COOKIE)?.value,
  );

  return (
    <AppShell
      brandName={brand.brandName}
      userName={user.name ?? "Admin"}
      role="Store Admin"
      badge="Admin"
      variant="admin"
      initialCollapsed={initialCollapsed}
    >
      {children}
    </AppShell>
  );
}
