"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { SidebarAccountMenu } from "@/components/layout/SidebarAccountMenu";
import { Sidebar } from "@/components/layout/Sidebar";
import { SiteAdminSidebar } from "@/components/layout/SiteAdminSidebar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SIDEBAR_PREF_COOKIE } from "@/lib/layout/sidebar-pref";
import type { BreadcrumbItem } from "@/lib/layout/breadcrumb";

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
  // Rantai breadcrumb untuk navbar, dihitung layout server dari pathname.
  breadcrumb: BreadcrumbItem[];
  // Konten halaman. Dibungkus `content` (bukan `children`) agar AppShell bisa
  // menyisipkan navbar di atasnya tanpa memodifikasi tiap halaman.
  content: ReactNode;
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
  breadcrumb,
  content,
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
    <div
      className="flex min-h-dvh flex-col lg:flex-row"
      style={{
        "--sidebar-width-expanded": "15rem",
        "--sidebar-width-collapsed": "4rem",
      } as React.CSSProperties}
    >
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
          // Hanya LEBAR sidebar yang beranimasi (300 ms). Anak-anaknya tidak
          // punya transisi sama sekali sehingga tidak ada dua animasi yang
          // bertabrakan — sumber "getar" saat menutup. Teks menyusut alami
          // lewat `truncate` mengikuti lebar kontainer.
          "flex flex-col border-b border-border bg-background transition-[width] duration-300 ease-out lg:fixed lg:inset-y-0 lg:left-0 lg:z-10 lg:border-b-0 lg:border-r",
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
          {/* Header sidebar TIDAK memuat tombol ringkas/buka. Sakelar ditempatkan
              di navbar kolom konten (lihat `AdminTopbar`), sehingga posisinya
              selalu sejajar dengan judul brand ini. Saat ringkas, nama brand dan
              lencana disembunyikan — hanya simbol brand (inisial) yang tampil,
              mengikuti referensi Figma. */}
          {collapsed && (
            <span
              aria-hidden="true"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary text-sm font-bold uppercase text-primary-foreground lg:h-7 lg:w-7 lg:text-xs"
            >
              {brandName.slice(0, 1)}
            </span>
          )}
          {!collapsed && (
            <>
              <Link href="/" className="truncate font-bold tracking-tight">
                {brandName}
              </Link>
              <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                {badge}
              </span>
            </>
          )}
        </div>

        {variant === "admin" ? (
          <Sidebar collapsed={collapsed} />
        ) : (
          <SiteAdminSidebar collapsed={collapsed} />
        )}

        {/* Footer sidebar hanya berisi sakelar tema dan menu akun — tanpa tombol
            ringkas/buka, karena sakelar ditempatkan di area konten. */}
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

      {/* Kolom konten berada di KANAN sidebar. `aside` memakai `lg:fixed`,
          jadi kolom ini yang menjaga jarak lewat padding kiri. Topbar kini
          memakai `fixed top-0` dan diletakkan tepat di kanan sidebar
          (lebar via --sidebar-width-*), sehingga tidak menutupi sidebar
          saat halaman digulir. Kolom juga menjadi induk setinggi halaman
          bagi konten `main`. */}
      <div
        className={cn(
          // Padding kiri kolom konten beranimasi SEIRAMA dengan lebar aside
          // (durasi & easing sama) supaya konten bergeser mulus bersama
          // sidebar, bukan menunggu/mendahului — ini yang menghilangkan gesekan
          // visual saat menutup.
          "flex flex-1 flex-col transition-[padding] duration-300 ease-out",
          collapsed ? "lg:pl-16" : "lg:pl-60",
        )}
      >
        <AdminTopbar
          collapsed={collapsed}
          onToggleCollapsed={toggleCollapsed}
          breadcrumb={breadcrumb}
        />

        <main className="flex-1 bg-muted/20 p-4 lg:p-8 lg:pt-24">
          {/* Konten halaman. Tombol ringkas/buka tidak ada di sini — kini
              berada di `AdminTopbar` (navbar), sehingga posisinya selalu
              sejajar dengan judul brand di sidebar. */}
          {content}
        </main>
      </div>
    </div>
  );
}
