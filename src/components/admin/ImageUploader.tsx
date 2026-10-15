"use client";

// Slot unggah gambar di form admin. Pratinjaunya meniru storefront supaya admin
// langsung melihat bentuk yang diatur (keputusan pengguna 2026-10-15):
// - `single`  : satu kotak dengan rasio yang sama seperti tampilan storefront
//               (banner 4:1, narasi 16:9, bagan ukuran rasio asli gambar).
// - `gallery` : gambar utama besar + strip thumbnail, meniru carousel galeri
//               halaman detail produk.
// - `lookbook`: grid editorial yang sama dengan seksi Lookbook storefront —
//               komponen `Lookbook` dipakai ulang supaya susunannya tidak bisa
//               melenceng dari tampilan asli.
// Aturan 1C tetap berlaku: slot penuh → dropzone tidak dirender.
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { ImageDropzone } from "@/components/ui/image-dropzone";
import { ImagePreview } from "@/components/ui/image-preview";
import { ImageRemoveButton } from "@/components/ui/image-remove-button";
import { Lookbook } from "@/components/products/EditorialSections";
import { MAX_PRODUCT_IMAGES } from "@/lib/products/validation";
import { useUploadThing } from "@/lib/uploadthing/client";
import { FormErrorAlert } from "@/components/ui/form-error-alert";
import { cn } from "@/lib/utils/cn";

type ImageUploaderProps = {
  urls: string[];
  setUrls: React.Dispatch<React.SetStateAction<string[]>>;
  // Batas jumlah gambar. Default galeri produk; slot tunggal memakai 1.
  max?: number;
  layout?: "single" | "gallery" | "lookbook";
  // Kotak media layout "single": rasio/warna mengikuti tampilan storefront slot
  // yang bersangkutan (dikirim pemanggil).
  mediaClassName?: string;
  fit?: "cover" | "contain";
  // Nama produk untuk teks alternatif pratinjau.
  productName?: string;
};

export function ImageUploader({
  urls,
  setUrls,
  max = MAX_PRODUCT_IMAGES,
  layout = "single",
  mediaClassName,
  fit = "cover",
  productName = "Produk",
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

  function removeUrl(url: string) {
    setUrls((previous) => previous.filter((item) => item !== url));
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        // Pratinjau galeri dibatasi lebarnya supaya gambar utama dan strip
        // thumbnail tidak memenuhi layar form (keputusan pengguna 2026-10-15:
        // ukuran gambar mengikuti container, jadi container-nya yang dikecilkan).
        // Batas ini hanya berlaku di form admin; halaman storefront tetap penuh.
        layout === "gallery" && "w-full max-w-sm",
      )}
    >
      <FormErrorAlert message={error} />

      {urls.length > 0 && layout === "gallery" ? (
        <GalleryPreview
          urls={urls}
          productName={productName}
          onRemove={removeUrl}
        />
      ) : null}

      {urls.length > 0 && layout === "lookbook" ? (
        <Lookbook
          urls={urls}
          productName={productName}
          renderAction={(url, index) => (
            <ImageRemoveButton
              label={`Hapus foto lookbook ${index + 1}`}
              onClick={() => removeUrl(url)}
            />
          )}
        />
      ) : null}

      {urls.length > 0 && layout === "single" ? (
        <ImagePreview
          url={urls[0]}
          alt={`Pratinjau ${productName}`}
          className="w-full"
          fit={fit}
          mediaClassName={mediaClassName ?? "aspect-square w-full"}
          onClear={() => removeUrl(urls[0])}
        />
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

// Pratinjau galeri meniru carousel detail produk: satu gambar utama persegi,
// lalu strip thumbnail persegi (aktif bergaris tebal). Tombol Hapus menempel
// di tiap gambar supaya pengaturan tetap bisa dilakukan tanpa mengubah bentuk.
function GalleryPreview({
  urls,
  productName,
  onRemove,
}: {
  urls: string[];
  productName: string;
  onRemove: (url: string) => void;
}) {
  const [active, setActive] = useState(0);
  const index = Math.min(active, urls.length - 1);
  const current = urls[index];
  // Strip = gambar selain yang sedang tampil di kotak besar. Dengan begitu
  // jumlah kotak sama dengan jumlah gambar (5 gambar = 1 besar + 4 kecil) dan
  // pratinjau tidak terlihat seperti punya slot tambahan.
  const thumbs = urls
    .map((url, itemIndex) => ({ url, itemIndex }))
    .filter((item) => item.itemIndex !== index);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current}
          alt={`${productName} gambar utama`}
          className="h-full w-full object-cover"
        />
        <ImageRemoveButton
          label="Hapus gambar utama"
          onClick={() => onRemove(current)}
          className="right-2 top-2 text-xs"
        />
      </div>

      {thumbs.length > 0 ? (
        <div
          className={cn(
            "grid gap-3",
            thumbs.length === 5 ? "grid-cols-5" : "grid-cols-4",
          )}
        >
          {thumbs.map(({ url, itemIndex }) => (
            <div key={`${itemIndex}-${url}`} className="relative">
              <button
                type="button"
                aria-label={`Tampilkan gambar ${itemIndex + 1}`}
                onClick={() => setActive(itemIndex)}
                className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-muted opacity-80 hover:opacity-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
              </button>
              <ImageRemoveButton
                label={`Hapus gambar ${itemIndex + 1}`}
                onClick={() => onRemove(url)}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
