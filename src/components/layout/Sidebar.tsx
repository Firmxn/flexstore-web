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

const LINKS: SidebarLink[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Pesanan", icon: ClipboardList },
  { href: "/admin/products", label: "Produk", icon: Package },
  { href: "/admin/categories", label: "Kategori", icon: Tags },
  { href: "/admin/brands", label: "Brand", icon: Store },
  { href: "/admin/vouchers", label: "Voucher", icon: Ticket },
  { href: "/admin/reports", label: "Laporan", icon: BarChart3 },
  { href: "/admin/cancellation-reasons", label: "Template Alasan", icon: FileText },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-3">
      {LINKS.map((link) => {
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
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out",
              collapsed && "lg:justify-center lg:gap-0 lg:px-0",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span
              className={cn(
                "truncate transition-all duration-300 ease-in-out",
                collapsed ? "lg:max-w-0 lg:opacity-0" : "max-w-40 opacity-100",
              )}
            >
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
