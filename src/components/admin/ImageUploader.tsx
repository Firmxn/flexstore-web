"use client";

import { useRef, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { MAX_PRODUCT_IMAGES } from "@/lib/products/validation";
import { useUploadThing } from "@/lib/uploadthing/client";

type ImageUploaderProps = {
  urls: string[];
  setUrls: React.Dispatch<React.SetStateAction<string[]>>;
};

export function ImageUploader({ urls, setUrls }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const { startUpload, isUploading } = useUploadThing("productImage", {
    onClientUploadComplete: (files) => {
      const uploaded = files.map((file) => file.serverData.url);
      setUrls((previous) =>
        [...previous, ...uploaded].slice(0, MAX_PRODUCT_IMAGES),
      );
      setError(null);
      if (inputRef.current) inputRef.current.value = "";
    },
    onUploadError: () => {
      setError("Gagal mengunggah gambar, coba lagi");
    },
  });

  async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const remaining = MAX_PRODUCT_IMAGES - urls.length;
    if (remaining <= 0) {
      setError(`Maksimal ${MAX_PRODUCT_IMAGES} gambar`);
      return;
    }

    await startUpload(files.slice(0, remaining));
  }

  return (
    <div className="flex flex-col gap-3">
      {error ? <Alert variant="destructive">{error}</Alert> : null}

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

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFiles}
          disabled={isUploading || urls.length >= MAX_PRODUCT_IMAGES}
        />
        <Button
          type="button"
          variant="outline"
          disabled={isUploading || urls.length >= MAX_PRODUCT_IMAGES}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? "Mengunggah..." : "Unggah Gambar"}
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">
          Maksimal {MAX_PRODUCT_IMAGES} gambar, masing-masing 4MB.
        </p>
      </div>
    </div>
  );
}
