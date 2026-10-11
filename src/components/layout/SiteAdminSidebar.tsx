"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

// SITE-00 (PH-08): navigasi area konfigurasi platform.
const LINKS = [
  { href: "/site-admin", label: "Dasbor", exact: true },
  { href: "/site-admin/settings", label: "Pengaturan Platform" },
  { href: "/site-admin/payment", label: "Payment Gateway" },
  { href: "/site-admin/shipping", label: "Shipping Provider" },
  { href: "/site-admin/users", label: "Store Admin" },
];

export function SiteAdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-3">
      {LINKS.map((link) => {
        // Dasbor ("/site-admin") hanya aktif saat persis, supaya tidak ikut
        // aktif di semua sub-halaman.
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
