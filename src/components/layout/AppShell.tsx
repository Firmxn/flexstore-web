"use client";

import { useState, type ReactNode } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { SidebarAccountMenu } from "@/components/layout/SidebarAccountMenu";
import { Sidebar } from "@/components/layout/Sidebar";
import { SiteAdminSidebar } from "@/components/layout/SiteAdminSidebar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SIDEBAR_PREF_COOKIE } from "@/lib/layout/sidebar-pref";

// Cookie preferensi sidebar (nilai: "collapsed" | "expanded") dibaca layout
// server via `lib/layout/sidebar-pref`. Dipilih di atas localStorage: lebar
// sidebar mengubah padding `main` yang dirender server, dan cookie bisa
// dibaca layout pada request pertama — localStorage menyebabkan
// FOUC/mismatch hydration pada render awal.
function setSidebarPrefCookie(collapsed: boolean) {
  document.cookie = `${SIDEBAR_PREF_COOKIE}=${
    collapsed ? "collapsed" : "expanded"
  }; max-age=31536000; path=/; SameSite=Lax`;
}

type AppShellProps = {
  brandName: string;
  userName: string;
  role: string;
  // Label lencana di samping nama brand ("Admin" / "Platform").
  badge: string;
  // Pemilih daftar tautan. Berupa string, BUKAN render prop: layout server
  // tidak boleh mengirim fungsi melewati batas server -> client (hanya data
  // yang bisa di-serialize). AppShell sendiri yang memutuskan navigasi mana
  // yang dirender dengan perilaku ringkas yang sama.
  variant: "admin" | "site-admin";
  initialCollapsed: boolean;
  children: ReactNode;
};

// Kerangka area terproteksi (aside + main), dipakai /admin dan /site-admin.
// Client component agar sakelar sidebar bekerja tanpa refresh: server
// mengirim nilai awal dari cookie, perubahan berikutnya murni client dan
// ditulis balik ke cookie.
export function AppShell({
  brandName,
  userName,
  role,
  badge,
  variant,
  initialCollapsed,
  children,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current;
      setSidebarPrefCookie(next);
      return next;
    });
  }

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      {/* Sidebar memakai `lg:fixed`, BUKAN `lg:sticky`. Penyebabnya Radix
          Select/Dialog saat popup terbuka menandai body `data-scroll-locked`
          + `overflow: hidden`, yang mengganti scroll container terdekat bagi
          elemen sticky — sticky berhenti menempel dan ikut tergulung (bug
          "sidebar belakang" saat dropdown pilih template dibuka di
          AdminOrderActions). `fixed` tidak terpengaruh overflow body. Saat
          ringkas, overflow dibuat visible supaya menu akun bisa membuka ke
          samping tanpa terpotong. */}
      <aside
        className={cn(
          "flex flex-col border-b border-border bg-background transition-[width] duration-300 ease-in-out lg:fixed lg:inset-y-0 lg:left-0 lg:z-10 lg:border-b-0 lg:border-r",
          collapsed
            ? "lg:w-16 lg:overflow-visible"
            : "lg:w-60 lg:overflow-y-auto",
        )}
      >
        <div
          className={cn(
            "flex h-16 shrink-0 items-center gap-2 border-b border-border px-4",
            collapsed && "justify-center px-0",
          )}
        >
          {collapsed ? (
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label="Kembalikan sidebar"
              className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <PanelLeftOpen className="h-5 w-5" />
            </button>
          ) : (
            <>
              <Link href="/" className="truncate font-bold tracking-tight">
                {brandName}
              </Link>
              <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                {badge}
              </span>
              <button
                type="button"
                onClick={toggleCollapsed}
                aria-label="Ringkas sidebar"
                className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <PanelLeftClose className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {variant === "admin" ? (
          <Sidebar collapsed={collapsed} />
        ) : (
          <SiteAdminSidebar collapsed={collapsed} />
        )}

        <div
          className={cn(
            "mt-auto flex flex-col gap-1 border-t border-border p-2",
            collapsed && "lg:border-t-0",
          )}
        >
          <ThemeToggle collapsed={collapsed} />
          <SidebarAccountMenu
            name={userName}
            role={role}
            collapsed={collapsed}
          />
        </div>
      </aside>

      <main
        className={cn(
          "flex-1 bg-muted/20 p-4 transition-[padding] duration-300 ease-in-out lg:p-8",
          // Padding mengikuti lebar sidebar + jarak 2rem (w-60 -> 17rem,
          // w-16 -> 6rem), konsisten dengan komentar di atas.
          collapsed ? "lg:pl-[6rem]" : "lg:pl-[17rem]",
        )}
      >
        {children}
      </main>
    </div>
  );
}
