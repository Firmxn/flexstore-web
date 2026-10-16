"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils/cn";

// Placeholder fitur tema (SITE-05 lanjutan). Untuk sekarang preferensi hanya
// berpindah antar nilai (dan tersimpan di cookie) tanpa mengubah token warna
// — globals.css belum punya varian `.dark`. Wiring-nya sudah siap: begitu
// token dark tersedia, cukup set class pada <html> di sini.
const THEME_COOKIE = "flexstore_theme_preview";

function setThemeCookie(byDarkMode: boolean) {
  document.cookie = `${THEME_COOKIE}=${
    byDarkMode ? "dark" : "light"
  }; max-age=31536000; path=/; SameSite=Lax`;
}

export function ThemeToggle({ collapsed }: { collapsed: boolean }) {
  const [darkMode, setDarkMode] = useState(false);
  const ThemeIcon = darkMode ? Moon : Sun;

  function toggle() {
    setDarkMode((current) => {
      setThemeCookie(!current);
      return !current;
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      // Placeholder: hanya memutar ikon dan menyimpan preferensi.
      // Belum mengubah tampilan apa pun.
      role="switch"
      aria-checked={darkMode}
      title={collapsed ? "Tema" : undefined}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 ease-in-out hover:bg-accent hover:text-foreground",
        collapsed && "lg:w-auto lg:justify-center lg:gap-0 lg:px-0",
      )}
    >
      <ThemeIcon className="h-5 w-5 shrink-0" />
      <span
        className={cn(
          "transition-all duration-300 ease-in-out",
          collapsed ? "lg:max-w-0 lg:opacity-0" : "max-w-40 opacity-100",
        )}
      >
        Tema
      </span>
    </button>
  );
}
