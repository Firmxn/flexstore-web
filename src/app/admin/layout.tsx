import { cookies, headers } from "next/headers";
import { AppShell } from "@/components/layout/AppShell";
import {
  isSidebarCollapsed,
  SIDEBAR_PREF_COOKIE,
} from "@/lib/layout/sidebar-pref";
import { requireStoreAdminPage } from "@/lib/auth/session";
import { getBrandSetting } from "@/lib/brand";
import { buildBreadcrumb } from "@/lib/layout/breadcrumb";
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

  // Pathname untuk breadcrumb navbar. Dibaca dari header request yang
  // disuntikkan `src/proxy.ts` — Next.js 16 tidak menyediakan API server untuk
  // pathname, dan `usePathname` adalah client hook yang tidak bisa dipakai di
  // layout server. Nilai cadangan hanya untuk saat proxy tidak jalan (mis. unit
  // test) — di aplikasi nyata proxy selalu menyetelnya.
  const headerStore = await headers();
  const currentPath = headerStore.get("x-pathname") ?? "/admin";

  return (
    <AppShell
      brandName={brand.brandName}
      userName={user.name ?? "Admin"}
      role="Store Admin"
      badge="Admin"
      variant="admin"
      initialCollapsed={initialCollapsed}
      breadcrumb={buildBreadcrumb(currentPath, "admin")}
      content={children}
    />
  );
}
