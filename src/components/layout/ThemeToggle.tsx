"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useThemePreview } from "@/lib/layout/theme-preview";

// Pemicu tema pratinjau (SITE-06 masih placeholder). Preferensi hanya
// berpindah antar nilai di cookie tanpa mengubah token warna — globals.css
// belum punya varian `.dark`. Kode sudah siap: begitu token dark tersedia,
// cukup set class `dark` pada <html> dari cookie saat render server
// (rancangan lengkap di docs/03 SITE-06).
export function ThemeToggle({ collapsed }: { collapsed: boolean }) {
  const { dark, toggle } = useThemePreview();
  const ThemeIcon = dark ? Moon : Sun;

  return (
    <button
      type="button"
      onClick={toggle}
      // Placeholder: hanya memutar ikon dan menyimpan preferensi.
      // Belum mengubah tampilan apa pun.
      role="switch"
      aria-checked={dark}
      title={collapsed ? "Tema" : undefined}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-300 ease-out hover:bg-accent hover:text-foreground",
        collapsed && "lg:w-auto lg:justify-center lg:gap-0 lg:px-0",
      )}
    >
      <ThemeIcon className="h-5 w-5 shrink-0" />
      <span
        className={cn(
          "truncate",
          collapsed ? "lg:max-w-0 lg:opacity-0" : "max-w-40 opacity-100",
        )}
      >
        Tema
      </span>
    </button>
  );
}
