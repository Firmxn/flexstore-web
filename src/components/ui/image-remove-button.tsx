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
        "absolute right-2 top-2 rounded bg-background/85 px-1.5 py-0.5 text-[10px] font-medium shadow-sm backdrop-blur transition-colors hover:bg-background",
        className,
      )}
    >
      Hapus
    </button>
  );
}
