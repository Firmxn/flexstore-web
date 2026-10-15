"use client";

// Dropzone unggah gambar seragam (docs/03 bagian 1C): kotak border-dashed
// dengan ikon awan-unggah, klik di mana saja atau seret berkas ke kotak untuk
// mengunggah; tombol "Browse Image" tetap jadi jalur keyboard (Enter/Spasi).
// Kontrak server Uploadthing tidak berubah — komponen ini hanya pengganti
// cara memilih berkas.
import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type ImageDropzoneProps = {
  onFiles: (files: File[]) => void | Promise<void>;
  // Semua endpoint pemakai memakai tipe `image` Uploadthing; accept ini hanya
  // penyaring awal dialog file, penolakan sesungguhnya di server.
  accept?: string;
  multiple?: boolean;
  uploading?: boolean;
  disabled?: boolean;
  // Teks kedua: sebutkan tipe yang diterima server per endpoint.
  typesText?: string;
  inputId?: string;
  className?: string;
};

export function ImageDropzone({
  onFiles,
  accept = "image/*",
  multiple = false,
  uploading = false,
  disabled = false,
  typesText = "Berkas gambar (JPG, PNG, WEBP, GIF) diterima.",
  inputId,
  className,
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const inactive = disabled || uploading;

  function openDialog() {
    if (!inactive) inputRef.current?.click();
  }

  function acceptFiles(files: File[]) {
    if (files.length > 0 && !inactive) void onFiles(files);
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-background p-6 text-center transition-colors",
        dragOver && "border-primary bg-muted/50",
        inactive
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer hover:bg-muted/40",
        className,
      )}
      onClick={openDialog}
      onDragOver={(event) => {
        event.preventDefault();
        if (!inactive) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragOver(false);
        acceptFiles(Array.from(event.dataTransfer?.files ?? []));
      }}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        disabled={inactive}
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          event.target.value = "";
          acceptFiles(files);
        }}
      />

      <span
        className="flex size-10 items-center justify-center rounded-full bg-muted"
        aria-hidden
      >
        <Upload className="size-5 text-muted-foreground" />
      </span>
      <p className="text-sm font-medium">
        Pilih berkas atau tarik dan lepas ke sini.
      </p>
      <p className="text-xs text-muted-foreground">{typesText}</p>
      <Button
        type="button"
        disabled={inactive}
        onClick={(event) => {
          event.stopPropagation();
          openDialog();
        }}
      >
        {uploading ? "Mengunggah..." : "Browse Image"}
      </Button>
    </div>
  );
}
