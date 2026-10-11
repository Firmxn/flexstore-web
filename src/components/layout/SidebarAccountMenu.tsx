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
};

// Menu akun di sidebar admin. Sama bentuknya dengan menu akun di navbar
// storefront (`HeaderAccountMenu`), tetapi panelnya membuka ke ATAS karena
// pemicunya duduk di dasar sidebar.
export function SidebarAccountMenu({ name, role }: SidebarAccountMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useDismiss<HTMLDivElement>(open, () => setOpen(false));

  return (
    <div className="relative" ref={rootRef}>
      {open ? (
        <div className="absolute bottom-full left-0 z-20 mb-1 w-full rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md">
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
        className="flex w-full items-center gap-2 rounded-md px-2 py-2 hover:bg-accent"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold uppercase text-muted-foreground">
          {initialsOf(name)}
        </span>
        <span className="min-w-0 flex-1 truncate text-left text-sm font-medium">
          {name}
        </span>
        <ChevronUp
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open ? "rotate-180" : null,
          )}
        />
      </button>
    </div>
  );
}
