// Preferensi tema pratinjau (SITE-06 masih placeholder): nilainya hanya
// disimpan di cookie `flexstore_theme_preview` — sama seperti sebelumnya —
// tetapi kini dibaca balik oleh setiap pemicu sehingga ikon mereka selalu
// menunjukkan pilihan yang tersimpan, bukan state lokal masing-masing.
// Modul netral (tanpa direktif "use client") mengikuti pola sidebar-pref;
// hanya dipanggil dari Client Component. Sinkronisasi antar pemicu (sidebar
// dan Pengaturan Toko hidup berdampingan di halaman admin yang sama)
// memakai event window setelah cookie ditulis.

import { useEffect, useState } from "react";

export const THEME_COOKIE = "flexstore_theme_preview";
const CHANGE_EVENT = "flexstore:theme-preview-changed";

export function readThemePreview(): boolean {
  return new RegExp(`(?:^|;\\s*)${THEME_COOKIE}=dark(?:;|$)`).test(
    document.cookie,
  );
}

function writeThemePreview(dark: boolean): void {
  document.cookie = `${THEME_COOKIE}=${dark ? "dark" : "light"}; max-age=31536000; path=/; SameSite=Lax`;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useThemePreview() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const sync = () => setDark(readThemePreview());
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    return () => window.removeEventListener(CHANGE_EVENT, sync);
  }, []);

  function toggle() {
    // Nilai berikutnya dihitung dari cookie (bukan state) supaya klik cepat
    // beruntun tidak memakai nilai basi dari closure.
    writeThemePreview(!readThemePreview());
  }

  return { dark, toggle };
}
