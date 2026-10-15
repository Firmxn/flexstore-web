"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ImageDropzone } from "@/components/ui/image-dropzone";
import { MAX_PRODUCT_IMAGES } from "@/lib/products/validation";
import { useUploadThing } from "@/lib/uploadthing/client";
import { FormErrorAlert } from "@/components/ui/form-error-alert";

type ImageUploaderProps = {
  urls: string[];
  setUrls: React.Dispatch<React.SetStateAction<string[]>>;
  // Batas jumlah gambar. Default galeri produk; bagan ukuran memakai 1.
  max?: number;
};

export function ImageUploader({
  urls,
  setUrls,
  max = MAX_PRODUCT_IMAGES,
}: ImageUploaderProps) {
  const [error, setError] = useState<string | null>(null);

  const { startUpload, isUploading } = useUploadThing("productImage", {
    onClientUploadComplete: (files) => {
      const uploaded = files.map((file) => file.serverData.url);
      setUrls((previous) => [...previous, ...uploaded].slice(0, max));
      setError(null);
    },
    onUploadError: () => {
      setError("Gagal mengunggah gambar, coba lagi");
    },
  });

  async function handleFiles(files: File[]) {
    const remaining = max - urls.length;
    if (remaining <= 0) {
      setError(`Maksimal ${max} gambar`);
      return;
    }

    await startUpload(files.slice(0, remaining));
  }

  return (
    <div className="flex flex-col gap-3">
      <FormErrorAlert message={error} />

      {urls.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {urls.map((url, index) => (
            <li
              key={url}
              className="flex flex-col gap-2 rounded-lg border border-border p-2"
            >
              {/* URL berasal dari Uploadthing; pakai img biasa agar tidak
                  bergantung pada allowlist domain next/image. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Gambar produk ${index + 1}`}
                className="aspect-square w-full rounded object-cover"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  setUrls((previous) =>
                    previous.filter((item) => item !== url),
                  )
                }
              >
                Hapus
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Belum ada gambar.</p>
      )}

      <ImageDropzone
        multiple={max > 1}
        uploading={isUploading}
        disabled={urls.length >= max}
        onFiles={handleFiles}
        typesText={`Maksimal ${max} gambar, masing-masing 4MB.`}
      />
    </div>
  );
}
