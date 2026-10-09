"use client";

import { useEffect } from "react";
import "./globals.css";

// Menangkap kegagalan pada root layout itu sendiri, yang tidak tertangkap oleh
// `error.tsx`. Karena berkas ini menggantikan root layout, ia harus menyediakan
// sendiri <html> dan <body> berikut stylesheet global - keduanya tidak
// diwariskan dari layout.
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("[app] root layout gagal", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
          <p className="text-sm font-semibold text-muted-foreground">
            Terjadi kesalahan
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            Aplikasi gagal dimuat
          </h1>
          <p className="text-sm text-muted-foreground">
            Ada gangguan saat memuat aplikasi. Silakan coba lagi sebentar lagi.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            className="mt-2 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Coba lagi
          </button>
        </div>
      </body>
    </html>
  );
}
