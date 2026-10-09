import { Suspense } from "react";
import Link from "next/link";
import { HeaderUserMenu } from "./HeaderUserMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          FlexStore
        </Link>

        <Suspense
          fallback={<div className="h-9 w-40 animate-pulse rounded-md bg-muted" />}
        >
          <HeaderUserMenu />
        </Suspense>
      </div>
    </header>
  );
}
