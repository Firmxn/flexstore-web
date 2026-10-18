"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils/cn";

// TASK-118 Lapis 1 (docs/03 PROD-01): teks konfirmasi tunggal untuk penghapusan
// gambar produk di form admin — poin pentingnya: berkasnya ikut hilang permanen
// dari penyimpanan, bukan cuma lepas dari form. Seluruh tombol Hapus gambar
// produk (galeri, informasi tambahan, cerita, lookbook, banner, varian) memakai
// teks ini supaya pesannya seragam.
export const IMAGE_DELETE_CONFIRM = {
  title: "Hapus gambar dari penyimpanan?",
  description:
    "Gambar akan dihapus permanen dari penyimpanan, bukan hanya dilepas dari form. Tindakan ini tidak bisa dibatalkan.",
} as const;

// Tombol "Hapus" kecil yang menempel di sudut gambar — gaya tunggal untuk semua
// pratinjau admin (keputusan pengguna 2026-10-15: "image preview (tepatnya
// tombol hapus) bagan ukuran, varian, dan gambar narasi, gue pengen di samain
// kayak gambar produk ataupun lookbook"). Dipakai pratinjau galeri, lookbook,
// dan pratinjau satu gambar (`ImagePreview`: informasi tambahan, narasi, banner,
// varian, bukti refund, aset brand). Kotak induknya wajib `relative`.
// Karena tombolnya menempel di dalam kotak media, tidak ada baris tombol
// terpisah yang menggeser tata letak kartu.
// Jarak 8px dari tepi (setengah radius 16px, keputusan pengguna 2026-10-15):
// lengkungan sudut `rounded-2xl` masuk cukup jauh sehingga tombol terlihat
// mepet kalau hanya 4px — bahkan 6px masih terasa mepet.
// Bila prop `confirm` diisi, klik pertama membuka `ConfirmDialog` (aturan 1B:
// dialog aplikasi, bukan `window.confirm`) dan penghapusan baru jalan setelah
// dikonfirmasi. Tanpa `confirm`, perilaku tetap langsung menghapus.
export function ImageRemoveButton({
  label,
  onClick,
  className,
  confirm,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  confirm?: { title: string; description: string };
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={label}
        title={label}
        onClick={() => (confirm ? setConfirming(true) : onClick())}
        className={cn(
          "absolute right-2 top-2 rounded bg-background/85 px-1.5 py-0.5 text-[10px] font-medium shadow-sm backdrop-blur transition-colors hover:bg-background",
          className,
        )}
      >
        Hapus
      </button>
      {confirm ? (
        <ConfirmDialog
          open={confirming}
          onOpenChange={setConfirming}
          title={confirm.title}
          description={confirm.description}
          confirmLabel="Hapus Gambar"
          onConfirm={async () => {
            onClick();
          }}
        />
      ) : null}
    </>
  );
}
