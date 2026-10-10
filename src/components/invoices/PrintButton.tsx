"use client";

import { Button } from "@/components/ui/button";

// Tombol cetak. Halaman invoice sengaja HTML siap-cetak supaya pengguna bisa
// menyimpan PDF lewat dialog cetak browser (tanpa dependensi PDF tambahan).
export function PrintButton() {
  return (
    <Button type="button" onClick={() => window.print()}>
      Cetak / Simpan PDF
    </Button>
  );
}
