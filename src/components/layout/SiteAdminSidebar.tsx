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

type SiteAdminSection = {
  label: string;
  links: SiteAdminLink[];
};

// SITE-00 (PH-08): navigasi area konfigurasi platform, dikelompokkan mengikuti
// pola sidebar Figma (section label + daftar item) seperti Sidebar Store Admin.
// - Platform: identitas dan konfigurasi toko (brand, pengaturan, payment, shipping)
// - Akun: pengelolaan akun Store Admin
const SECTIONS: SiteAdminSection[] = [
  {
    label: "Platform",
    links: [
      { href: "/site-admin", label: "Dasbor", icon: LayoutDashboard, exact: true },
      { href: "/site-admin/brand", label: "Identitas Brand", icon: Palette },
      { href: "/site-admin/settings", label: "Pengaturan Platform", icon: SlidersHorizontal },
      { href: "/site-admin/payment", label: "Payment Gateway", icon: CreditCard },
      { href: "/site-admin/shipping", label: "Shipping Provider", icon: Truck },
    ],
  },
  {
    label: "Akun",
    links: [
      { href: "/site-admin/users", label: "Store Admin", icon: Users },
    ],
  },
];

export function SiteAdminSidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col p-3">
      {SECTIONS.map((section, index) => (
        <div
          key={section.label}
          // Label section disembunyikan saat ringkas (hanya ikon yang tampil);
          // divider antar group dipakai sebagai pemisah visual pengganti label,
          // meniru referensi Figma mode collapsed.
          className={cn(
            "flex flex-col gap-1",
            index > 0 && "mt-4 border-t border-border pt-4",
            index > 0 && collapsed && "lg:mt-3 lg:pt-3",
          )}
        >
          <p
            className={cn(
              "px-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
              collapsed && "lg:hidden",
            )}
          >
            {section.label}
          </p>
          {section.links.map((link) => {
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
                  // Samakan dengan Sidebar: tanpa transisi layout, hanya warna.
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
