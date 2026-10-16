"use client";

import { useState } from "react";
import { ChevronUp, LogOut } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { initialsOf } from "@/lib/utils/initials";
import { useDismiss } from "@/lib/hooks/useDismiss";
import { LogoutButton } from "@/components/auth/LogoutButton";

type SidebarAccountMenuProps = {
  name: string;
  role: string;
  // Opsional: dipakai sidebar site-admin yang belum punya mode ringkas.
  collapsed?: boolean;
};

// Menu akun di dasar sidebar admin, mirip kartu profil pada referensi
// desain. Panel membuka ke ATAS saat sidebar penuh; saat sidebar ringkas
// pemicu tinggal avatar dan panel membuka ke SAMPING (sidebar tidak boleh
// memotong panel, `overflow-visible` sudah diatur di AppShell).
export function SidebarAccountMenu({
  name,
  role,
  collapsed = false,
}: SidebarAccountMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useDismiss<HTMLDivElement>(open, () => setOpen(false));

  return (
    <div className="relative" ref={rootRef}>
      {open ? (
        <div
          className={cn(
            "absolute z-20 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md",
            collapsed
              ? "bottom-0 left-full ml-2 w-56"
              : "bottom-full left-0 mb-1 w-full",
          )}
        >
          <div className="px-2 py-1.5">
            <p className="truncate text-sm font-medium">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{role}</p>
          </div>

          <div className="my-1 h-px bg-border" />

          <LogoutButton
            icon={<LogOut className="h-4 w-4" />}
            className="w-full justify-start gap-2 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
          />
        </div>
      ) : null}

      <button
        type="button"
        aria-expanded={open}
        aria-label={`Menu akun ${name}`}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg border border-border px-2 py-2 hover:bg-accent",
          collapsed && "lg:justify-center lg:border-transparent lg:bg-transparent lg:px-0",
        )}
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold uppercase text-primary-foreground">
          {initialsOf(name)}
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block truncate text-sm font-medium">{name}</span>
          <span className="block truncate text-xs text-muted-foreground">
            {role}
          </span>
        </span>
        <ChevronUp
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open ? "rotate-180" : null,
            collapsed && "lg:hidden",
          )}
        />
      </button>
    </div>
  );
}
