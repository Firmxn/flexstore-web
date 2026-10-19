"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  Store,
  Tags,
  Ticket,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type SidebarLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type SidebarSection = {
  label: string;
  links: SidebarLink[];
};

// Dikelompokkan mengikuti pola sidebar Figma (section label + daftar item),
// disesuaikan kebutuhan FlexStore Store Admin (ADMIN-DASH-01, 2026-10-16):
// - Operasional: inti kerja harian admin (dasbor, pesanan, produk, laporan)
// - Katalog: pengelolaan isi katalog (kategori, brand, voucher)
// - Administrasi: pengaturan sistem (template alasan, pengaturan)
// Item "Users/Customers" dan "Help card" dari referensi sengaja tidak diambil
// — store admin FlexStore tidak punya halaman terkait.
const SECTIONS: SidebarSection[] = [
  {
    label: "Operasional",
    links: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/orders", label: "Pesanan", icon: ClipboardList },
      { href: "/admin/products", label: "Produk", icon: Package },
      { href: "/admin/reports", label: "Laporan", icon: BarChart3 },
    ],
  },
  {
    label: "Katalog",
    links: [
      { href: "/admin/categories", label: "Kategori", icon: Tags },
      { href: "/admin/brands", label: "Brand", icon: Store },
      { href: "/admin/vouchers", label: "Voucher", icon: Ticket },
    ],
  },
  {
    label: "Administrasi",
    links: [
      {
        href: "/admin/cancellation-reasons",
        label: "Template Alasan",
        icon: FileText,
      },
      { href: "/admin/settings", label: "Pengaturan", icon: Settings },
    ],
  },
];

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col p-3">
      {SECTIONS.map((section, index) => (
        <div
          key={section.label}
          // Saat ringkas, label section hilang sehingga antar group tidak lagi
          // terpisah teks — divider pengganti dipakai, meniru referensi Figma
          // (mode collapsed memisah group dengan garis tipis, bukan sekadar jarak).
          className={cn(
            "flex flex-col gap-1",
            index > 0 && "mt-4 border-t border-border pt-4",
            index > 0 && collapsed && "lg:mt-3 lg:pt-3",
          )}
        >
          {/* Label section disembunyikan saat ringkas (hanya ikon yang tampil),
              tapi tetap tampil di mobile (sidebar berupa bar atas). */}
          <p
            className={cn(
              "px-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
              collapsed && "lg:hidden",
            )}
          >
            {section.label}
          </p>
          {section.links.map((link) => {
            // `/admin` harus exact match — startsWith akan menyalakan semua menu
            // karena semua rute admin berprefiks `/admin`.
            const active =
              link.href === "/admin"
                ? pathname === link.href
                : pathname.startsWith(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                // Mode ringkas hanya berlaku di desktop (lg:) — di mobile sidebar
                // berupa bar atas dan label harus tetap terlihat.
                title={collapsed ? link.label : undefined}
                aria-label={collapsed ? link.label : undefined}
                className={cn(
                  // Tanpa transisi layout: padding/gap/justify ikut state secara
                  // langsung supaya tidak bergetar. Hanya warna yang dihaluskan
                  // (hover tetap nyaman, warna tidak memengaruhi layout).
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-300 ease-out",
                  collapsed && "lg:justify-center lg:gap-0 lg:px-0",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span
                  className={cn(
                    "truncate",
                    collapsed ? "lg:max-w-0 lg:opacity-0" : "max-w-40 opacity-100",
                  )}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
