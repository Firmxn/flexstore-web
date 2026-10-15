"use client";

import { ImageDropzone } from "@/components/ui/image-dropzone";
import { ImagePreview } from "@/components/ui/image-preview";
import { Label } from "@/components/ui/label";

// SITE-05 (PH-09): pemilih satu berkas gambar brand (logo, favicon, banner).
// Unggahan dilakukan lewat hook `useUploadThing` milik pemanggil; komponen ini
// hanya UI supaya endpoint Uploadthing tetap terketik literal di satu tempat.
// Cara memilih berkas memakai dropzone dan preview memakai kartu seragam
// (docs/03 bagian 1C).

export function AssetPicker({
  id,
  label,
  hint,
  url,
  mediaClassName,
  fit,
  uploading,
  onUpload,
  onClear,
}: {
  id: string;
  label: string;
  hint: string;
  url: string;
  mediaClassName?: string;
  fit?: "cover" | "contain";
  uploading: boolean;
  onUpload: (files: File[]) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>

      <ImagePreview
        url={url}
        alt={label}
        fit={fit}
        mediaClassName={mediaClassName ?? "aspect-square w-48"}
        onClear={onClear}
      />

      <ImageDropzone
        inputId={id}
        uploading={uploading}
        disabled={Boolean(url)}
        onFiles={(files) => onUpload(files.slice(0, 1))}
        typesText={
          url
            ? "Sudah ada berkas. Hapus dulu untuk mengganti."
            : hint
        }
        className="p-4"
      />
    </div>
  );
}
