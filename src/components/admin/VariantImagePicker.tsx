"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { ImageDropzone } from "@/components/ui/image-dropzone";
import { ImagePreview } from "@/components/ui/image-preview";
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

  async function handleFiles(files: File[]) {
    const file = files[0];
    if (!file) return;

    await startUpload([file]);
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>Gambar varian (opsional)</Label>

      <ImagePreview
        url={url}
        alt="Gambar varian"
        mediaClassName="h-24 w-24"
        onClear={url ? () => onChange("") : undefined}
      />

      <ImageDropzone
        inputId={id}
        uploading={isUploading}
        onFiles={handleFiles}
        typesText="Satu berkas gambar, maksimal 4MB."
        className="p-4"
      />

      <FormErrorAlert message={error} />
    </div>
  );
}
