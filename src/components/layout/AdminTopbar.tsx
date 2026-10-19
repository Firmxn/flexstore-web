"use client";

import Link from "next/link";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { BreadcrumbItem } from "@/lib/layout/breadcrumb";

type AdminTopbarProps = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  breadcrumb: BreadcrumbItem[];
};

// Navbar area admin, menempati kolom konten di KANAN sidebar: tombol
// ringkas/buka di kiri, lalu breadcrumb yang menunjukkan alur halaman saat ini
// (contoh: "Produk > Tambah"). Posisinya `fixed top-0` sehingga tetap terlihat
// saat halaman digulir, dan diletakkan tepat di kanan sidebar (lebar disesuaikan
// lewat --sidebar-width-*) — tidak menutupi sidebar.
export function AdminTopbar({
  collapsed,
  onToggleCollapsed,
  breadcrumb,
}: AdminTopbarProps) {
  return (
    <header
      className={cn(
        // `fixed` agar navbar menempel di layar saat digulir, dan diletakkan
        // tepat di kanan sidebar (lebar disesuaikan lewat --sidebar-width).
        "fixed top-0 z-20 border-b border-border bg-background transition-[left,width] duration-300 ease-out",
        collapsed
          ? "lg:left-[var(--sidebar-width-collapsed)] lg:w-[calc(100%-var(--sidebar-width-collapsed))]"
          : "lg:left-[var(--sidebar-width-expanded)] lg:w-[calc(100%-var(--sidebar-width-expanded))]",
      )}
    >
      <div className="flex h-16 items-center gap-2 px-4 lg:px-8">
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Buka sidebar" : "Ringkas sidebar"}
          aria-expanded={!collapsed}
          title={collapsed ? "Buka sidebar" : "Ringkas sidebar"}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>

        <nav aria-label="Breadcrumb" className="min-w-0">
          <ol className="flex items-center gap-1.5 text-sm">
            {breadcrumb.map((item, index) => {
              const isLast = index === breadcrumb.length - 1;

              return (
                <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                  {index > 0 ? (
                    <span aria-hidden="true" className="text-muted-foreground/60">
                      /
                    </span>
                  ) : null}
                  {isLast || item.href === null ? (
                    // Segmen terakhir (dan segmen pembuka area) tidak jadi link:
                    // pengguna sudah berada di sana / itu penanda area, bukan tujuan.
                    <span
                      className={cn(
                        "truncate",
                        isLast
                          ? "font-medium text-foreground"
                          : "text-muted-foreground",
                      )}
                      aria-current={isLast ? "page" : undefined}
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="truncate text-muted-foreground hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </header>
  );
}
