import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Sidebar } from "@/components/layout/Sidebar";
import { requireStoreAdminPage } from "@/lib/auth/session";

// Seluruh area admin bergantung pada session, jadi tidak ada gunanya
// diprerender. `instant = false` menandai route ini sebagai blocking route
// (Next.js 16 cacheComponents) sehingga tidak ada data dinamis di luar Suspense.
export const instant = false;

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Proteksi berlapis: proxy menahan request, dan layout ini memastikan role
  // STORE_ADMIN sebelum halaman admin dirender (OWASP A01).
  const user = await requireStoreAdminPage();

  return (
    <div className="flex min-h-full flex-col lg:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-border bg-background lg:min-h-screen lg:w-60 lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center gap-2 border-b border-border px-4">
          <Link href="/" className="font-bold tracking-tight">
            FlexStore
          </Link>
          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
            Admin
          </span>
        </div>

        <Sidebar />

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border px-3 py-3">
          <span className="truncate text-xs text-muted-foreground">
            {user.name}
          </span>
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 bg-muted/20 p-4 lg:p-8">{children}</main>
    </div>
  );
}
