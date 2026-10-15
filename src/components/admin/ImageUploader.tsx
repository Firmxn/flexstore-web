"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { ImageDropzone } from "@/components/ui/image-dropzone";
import { ImagePreview } from "@/components/ui/image-preview";
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
        // Satu wadah untuk galeri (banyak berkas) dan bagan ukuran (satu):
        // kartu `w-48` seragam mengikuti lebar kartu galeri, terpusat baik
        // saat satu maupun banyak berkas.
        <div className="flex flex-wrap justify-center gap-3">
          {urls.map((url, index) => (
            <ImagePreview
              key={url}
              url={url}
              alt={
                max === 1
                  ? "Gambar bagan ukuran"
                  : `Gambar produk ${index + 1}`
              }
              // Bagan ukuran mengikuti tampilan storefront (`aspect-[4/3]`
              // sm:aspect-[16/9] + object-contain) — rasio horizontal, tanpa
              // krop, karena isinya detail tabel; kartunya selebar dropzone
              // (`w-full`) sesuai permintaan pengguna.
              className={max === 1 ? "w-full" : "w-48"}
              // Bagan ukuran mengikuti tampilan storefront (`aspect-[4/3]`
              // sm:aspect-[16/9] + object-contain) — rasio horizontal, tanpa
              // krop, karena isinya detail tabel.
              fit={max === 1 ? "contain" : "cover"}
              mediaClassName={
                max === 1
                  ? "aspect-[4/3] sm:aspect-[16/9] w-full"
                  : undefined
              }
              onClear={() =>
                setUrls((previous) =>
                  previous.filter((item) => item !== url),
                )
              }
            />
          ))}
        </div>
      ) : null}

      {/* Slot penuh → dropzone tidak dirender sama sekali (aturan 1C); muncul
          kembali begitu salah satu gambar dihapus. */}
      {urls.length < max ? (
        <ImageDropzone
          multiple={max > 1}
          uploading={isUploading}
          onFiles={handleFiles}
          typesText={`Maksimal ${max} gambar, masing-masing 4MB.`}
        />
      ) : null}
    </div>
  );
}
