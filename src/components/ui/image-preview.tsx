"use client";

// Preview gambar seragam (teman `ImageDropzone`, docs/03 bagian 1C): kartu
// bergaris sama di seluruh titik unggah — kotak media netral berisi gambar
// (atau placeholder "Belum ada gambar.") dan tombol "Hapus" pada baris yang
// sama. Ukuran kotak media diatur pemanggil lewat `mediaClassName`.
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type ImagePreviewProps = {
  url: string;
  alt: string;
  onClear?: () => void;
  fit?: "cover" | "contain";
  // Ukuran kotak media; default kotak persegi penuh lebar.
  mediaClassName?: string;
  emptyText?: string;
  className?: string;
};

export function ImagePreview({
  url,
  alt,
  onClear,
  fit = "cover",
  mediaClassName = "aspect-square w-full",
  emptyText = "Belum ada gambar.",
  className,
}: ImagePreviewProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border border-border bg-background p-2",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center overflow-hidden rounded bg-muted",
          mediaClassName,
        )}
      >
        {url ? (
          // URL berasal dari Uploadthing; pakai img biasa agar tidak bergantung
          // pada allowlist domain next/image.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={alt}
            className={cn(
              "h-full w-full",
              fit === "cover" ? "object-cover" : "object-contain",
            )}
          />
        ) : (
          <span className="px-2 text-center text-xs text-muted-foreground">
            {emptyText}
          </span>
        )}
      </div>

      {onClear ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 self-end text-xs"
          onClick={onClear}
        >
          Hapus
        </Button>
      ) : null}
    </div>
  );
}
