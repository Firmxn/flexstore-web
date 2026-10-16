"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  LayoutDashboard,
  Palette,
  SlidersHorizontal,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type SiteAdminLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

// SITE-00 (PH-08): navigasi area konfigurasi platform.
const LINKS: SiteAdminLink[] = [
  { href: "/site-admin", label: "Dasbor", icon: LayoutDashboard, exact: true },
  { href: "/site-admin/brand", label: "Identitas Brand", icon: Palette },
  { href: "/site-admin/settings", label: "Pengaturan Platform", icon: SlidersHorizontal },
  { href: "/site-admin/payment", label: "Payment Gateway", icon: CreditCard },
  { href: "/site-admin/shipping", label: "Shipping Provider", icon: Truck },
  { href: "/site-admin/users", label: "Store Admin", icon: Users },
];

export function SiteAdminSidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-3">
      {LINKS.map((link) => {
        // Dasbor ("/site-admin") hanya aktif saat persis, supaya tidak ikut
        // aktif di semua sub-halaman.
        const active = link.exact
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
