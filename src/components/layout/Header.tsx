import { Suspense } from "react";
import Link from "next/link";
import { getBrandSetting } from "@/lib/brand";
import { CartBadge } from "./CartBadge";
import { HeaderUserMenu } from "./HeaderUserMenu";
import { NotificationBell } from "./NotificationBell";

// SITE-05 (PH-09): nama brand dan logo mengikuti pengaturan Site Admin.
export async function Header() {
  const brand = await getBrandSetting();

  return (
    <header className="fixed inset-x-0 top-0 z-10 border-b border-border bg-background/95 backdrop-blur print:hidden">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          {brand.logoUrl ? (
            // URL berasal dari Uploadthing; pakai img biasa agar tidak
            // bergantung pada allowlist domain next/image.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={brand.logoUrl}
              alt={brand.brandName}
              className="h-8 w-auto"
            />
          ) : (
            brand.brandName
          )}
        </Link>

        <div className="flex items-center gap-3">
          <Suspense
            fallback={<div className="h-9 w-9 animate-pulse rounded-md bg-muted" />}
          >
            <NotificationBell />
          </Suspense>
          <Suspense
            fallback={<div className="h-9 w-24 animate-pulse rounded-md bg-muted" />}
          >
            <CartBadge />
          </Suspense>
          <Suspense
            fallback={<div className="h-9 w-64 animate-pulse rounded-md bg-muted" />}
          >
            <HeaderUserMenu />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
