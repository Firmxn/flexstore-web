// Tombol "Hapus" kecil yang menempel di sudut gambar — gaya tunggal untuk semua
// pratinjau admin (keputusan pengguna 2026-10-15: "image preview (tepatnya
// tombol hapus) bagan ukuran, varian, dan gambar narasi, gue pengen di samain
// kayak gambar produk ataupun lookbook"). Dipakai pratinjau galeri, lookbook,
// dan pratinjau satu gambar (`ImagePreview`: bagan ukuran, narasi, banner,
// varian, bukti refund, aset brand). Kotak induknya wajib `relative`.
// Karena tombolnya menempel di dalam kotak media, tidak ada baris tombol
// terpisah yang menggeser tata letak kartu.
// Jarak 2px dari tepi (bukan 1px) karena kotak gambar memakai radius 16px
// (`rounded-2xl`, keputusan pengguna 2026-10-15) sehingga lengkungan sudutnya
// lebih masuk — dengan 1px tombolnya terlihat mepet ke border.
import { cn } from "@/lib/utils/cn";

export function ImageRemoveButton({
  label,
  onClick,
  className,
}: {
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "absolute right-1.5 top-1.5 rounded bg-background/85 px-1.5 py-0.5 text-[10px] font-medium shadow-sm backdrop-blur transition-colors hover:bg-background",
        className,
      )}
    >
      Hapus
    </button>
  );
}
