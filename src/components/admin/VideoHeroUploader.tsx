"use client";

// PROD-07 — unggah video hero produk (endpoint `videoHero`, plafon 64MB)
// plus sakelar autoplay yang dikontrol admin (keputusan pengguna docs/04).
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormErrorAlert } from "@/components/ui/form-error-alert";
import { useUploadThing } from "@/lib/uploadthing/client";

export function VideoHeroUploader({
  url,
  autoplay,
  onUrlChange,
  onAutoplayChange,
}: {
  url: string;
  autoplay: boolean;
  onUrlChange: (url: string) => void;
  onAutoplayChange: (autoplay: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const { startUpload, isUploading } = useUploadThing("videoHero", {
    onClientUploadComplete: (files) => {
      const uploaded = files[0];
      if (uploaded) onUrlChange(uploaded.serverData.url);
      setError(null);
    },
    onUploadError: () => {
      setError("Gagal mengunggah video, coba lagi");
    },
  });

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    await startUpload([file]);
  }

  return (
    <div className="flex flex-col gap-3">
      <FormErrorAlert message={error} />

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="sr-only"
        onChange={(event) => {
          void handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      {url ? (
        <div className="flex flex-col gap-2">
          <video
            src={url}
            muted
            playsInline
            controls
            className="aspect-video w-full sm:aspect-[4/1] rounded-2xl border border-border bg-muted object-cover"
          />
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onUrlChange("")}
            >
              Hapus video
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="flex aspect-video w-full sm:aspect-[4/1] flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-border bg-muted text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
        >
          <span className="font-medium text-foreground">
            {isUploading ? "Mengunggah..." : "Pilih berkas video"}
          </span>
          <span>MP4/WebM, maksimal 64MB</span>
        </button>
      )}

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={autoplay}
          onChange={(event) => onAutoplayChange(event.target.checked)}
          className="h-4 w-4"
        />
        Putar otomatis (senyap) di halaman produk
      </label>
    </div>
  );
}
