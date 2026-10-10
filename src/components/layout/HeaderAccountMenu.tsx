"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LogOut, Package, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { LogoutButton } from "@/components/auth/LogoutButton";

type HeaderAccountMenuProps = {
  name: string;
  role: string;
};

// Inisial untuk avatar: maksimal 2 huruf pertama tiap kata.
function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

// Menu akun di navbar. Berbeda dengan nav link biasa: tombol ini membuka panel
// yang berisi identitas pengguna dan aksi kelola akun. Ditulis sebagai client
// component karena perlu state buka/tutup, sementara pemiliknya (HeaderUserMenu)
// tetap server component.
export function HeaderAccountMenu({
  name,
  role,
}: HeaderAccountMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (!target || !rootRef.current?.contains(target)) setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const menuItemClass =
    "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm font-medium";

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-label={`Menu akun ${name}`}
        onClick={() => setOpen((current) => !current)}
        className="flex h-9 items-center gap-2 rounded-md px-2 hover:bg-accent"
      >
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-muted text-[10px] font-semibold uppercase text-muted-foreground">
          {initialsOf(name)}
        </span>
        <span className="hidden max-w-32 truncate text-sm font-medium sm:inline">
          {name}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform",
            open ? "rotate-180" : null,
          )}
        />
      </button>

      {open ? (
        <div
          aria-label="Menu akun"
          className="absolute right-0 top-full z-20 mt-1 w-56 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
        >
          <div className="px-2 py-1.5">
            <p className="truncate text-sm font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">
              {role === "STORE_ADMIN" ? "Store Admin" : "Pelanggan"}
            </p>
          </div>

          <div className="my-1 h-px bg-border" />

          <Link
            href="/orders"
            onClick={() => setOpen(false)}
            className={cn(
              menuItemClass,
              "hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Package className="h-4 w-4 text-muted-foreground" />
            Pesanan saya
          </Link>

          {role === "STORE_ADMIN" ? (
            <Link
              href="/admin/products"
              onClick={() => setOpen(false)}
              className={cn(
                menuItemClass,
                "hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              Panel admin
            </Link>
          ) : null}

          <div className="my-1 h-px bg-border" />

          <LogoutButton
            icon={<LogOut className="h-4 w-4 text-destructive" />}
            className="w-full justify-start px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
          />
        </div>
      ) : null}
    </div>
  );
}
