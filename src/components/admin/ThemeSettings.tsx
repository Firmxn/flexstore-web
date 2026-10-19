"use client";

import { Moon, Sun } from "lucide-react";
import { useThemePreview } from "@/lib/layout/theme-preview";

// SITE-06 (status: belum diimplementasikan) — pemicu tema pratinjau di
// halaman Pengaturan Toko, menemani tombol "Tema" di sidebar. Perilaku sama
// persis: ikon berputar dan preferensi ditulis ke cookie
// `flexstore_theme_preview`, tetapi palet warna belum berubah karena
// globals.css belum punya varian `.dark`.
export function ThemeSettings() {
  const { dark, toggle } = useThemePreview();

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold">Tema Tampilan</h2>
        <p className="text-sm text-muted-foreground">
          Pratinjau preferensi tema — pilihan tersimpan di peramban ini,
          perubahan warna menyusul bersama mode gelap.
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={dark}
        aria-label="Tema tampilan"
        onClick={toggle}
        className="flex w-fit items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        {dark ? "Gelap" : "Terang"}
      </button>
    </section>
  );
}
