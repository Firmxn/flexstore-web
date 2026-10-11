"use client";

import { useRef, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useUploadThing } from "@/lib/uploadthing/client";
import { FormErrorAlert } from "@/components/ui/form-error-alert";

// Gambar varian opsional (PRD 3.1.A/7.4). Memakai endpoint `productImage` yang
// sama dengan galeri produk, tetapi hanya satu berkas per varian sehingga
// pemilihnya dibuat ringkas, bukan `ImageUploader` (yang berbentuk daftar).
export function VariantImagePicker({
  id,
  url,
  onChange,
}: {
  id: string;
  url: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const { startUpload, isUploading } = useUploadThing("productImage", {
    onClientUploadComplete: (files) => {
      const uploaded = files[0]?.serverData.url;
      if (uploaded) onChange(uploaded);
      setError(null);
    },
    onUploadError: () => {
      setError("Gagal mengunggah gambar, coba lagi");
    },
  });

  async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    await startUpload([file]);
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>Gambar varian (opsional)</Label>

      <div className="flex items-center gap-3">
        {url ? (
          // URL berasal dari Uploadthing; pakai img biasa agar tidak bergantung
          // pada allowlist domain next/image.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt="Gambar varian"
            className="size-16 rounded border border-border object-cover"
          />
        ) : (
          <div className="flex size-16 items-center justify-center rounded border border-dashed border-border text-xs text-muted-foreground">
            Kosong
          </div>
        )}

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={isUploading}
            onChange={handleFiles}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            {isUploading ? "Mengunggah..." : url ? "Ganti" : "Unggah"}
          </Button>
          {url ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange("")}
            >
              Hapus
            </Button>
          ) : null}
        </div>
      </div>

      <FormErrorAlert message={error} />
    </div>
  );
}
