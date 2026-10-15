"use client";

import { Button } from "@/components/ui/button";
import { ImageDropzone } from "@/components/ui/image-dropzone";
import { Label } from "@/components/ui/label";

// SITE-05 (PH-09): pemilih satu berkas gambar brand (logo, favicon, banner).
// Unggahan dilakukan lewat hook `useUploadThing` milik pemanggil; komponen ini
// hanya UI supaya endpoint Uploadthing tetap terketik literal di satu tempat.
// Cara memilih berkasnya memakai dropzone seragam (docs/03 bagian 1C).

export function AssetPicker({
  id,
  label,
  hint,
  url,
  previewClassName,
  uploading,
  onUpload,
  onClear,
}: {
  id: string;
  label: string;
  hint: string;
  url: string;
  previewClassName?: string;
  uploading: boolean;
  onUpload: (files: File[]) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>

      {url ? (
        // URL berasal dari Uploadthing; pakai img biasa agar tidak bergantung
        // pada allowlist domain next/image.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={label}
          className={
            previewClassName ?? "h-16 w-auto rounded border border-border object-contain"
          }
        />
      ) : (
        <p className="text-sm text-muted-foreground">Belum ada berkas.</p>
      )}

      <ImageDropzone
        inputId={id}
        uploading={uploading}
        onFiles={(files) => onUpload(files.slice(0, 1))}
        typesText={hint}
        className="p-4"
      />

      {url ? (
        <Button type="button" variant="ghost" size="sm" className="self-start" onClick={onClear}>
          Hapus
        </Button>
      ) : null}
    </div>
  );
}
