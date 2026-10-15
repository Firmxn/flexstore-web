"use client";

// Preview gambar seragam (teman `ImageDropzone`, docs/03 bagian 1C): satu kotak
// bergaris berisi gambar dan tombol "Hapus" yang menempel di sudut kanan atas
// gambar — bentuknya persis seperti gambar pada pratinjau galeri dan lookbook
// (tanpa kartu pembungkus berpadding), jadi seluruh pratinjau gambar admin
// seragam (keputusan pengguna 2026-10-15). Tanpa keadaan kosong (dropzone di
// bawahnya sudah menjadi penanda). Ukuran kotak diatur pemanggil lewat
// `mediaClassName`, dan `className` untuk penempatan (mis. `w-48 mx-auto`).
import { ImageRemoveButton } from "@/components/ui/image-remove-button";
import { cn } from "@/lib/utils/cn";

type ImagePreviewProps = {
  url: string;
  alt: string;
  onClear?: () => void;
  fit?: "cover" | "contain";
  // Ukuran kotak media; default kotak persegi penuh lebar.
  mediaClassName?: string;
  // Penempatan/ukuran kotak (mis. `w-48 mx-auto`); digabung dengan
  // `mediaClassName` lewat `cn` sehingga kelas yang belakangan menang.
  className?: string;
};

export function ImagePreview({
  url,
  alt,
  onClear,
  fit = "cover",
  mediaClassName = "aspect-square w-full",
  className,
}: ImagePreviewProps) {
  // Tanpa keadaan kosong: bila belum ada berkas, dropzone di bawahnya sudah
  // menjadi penanda — komponen ini hanya membingkai gambar yang sudah ada.
  if (!url) return null;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted",
        mediaClassName,
        className,
      )}
    >
      {/* URL berasal dari Uploadthing; pakai img biasa agar tidak bergantung
          pada allowlist domain next/image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt}
        className={cn(
          "h-full w-full",
          fit === "cover" ? "object-cover" : "object-contain",
        )}
      />

      {onClear ? (
        <ImageRemoveButton label="Hapus gambar" onClick={onClear} />
      ) : null}
    </div>
  );
}
