"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// SITE-05 (PH-09): pemilih satu berkas gambar brand (logo, favicon, banner).
// Unggahan dilakukan lewat hook `useUploadThing` milik pemanggil; komponen ini
// hanya UI supaya endpoint Uploadthing tetap terketik literal di satu tempat.

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
  const inputRef = useRef<HTMLInputElement>(null);

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

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={uploading}
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          if (files.length > 0) onUpload(files);
          event.target.value = "";
        }}
      />

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Mengunggah..." : "Unggah"}
        </Button>
        {url ? (
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            Hapus
          </Button>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
