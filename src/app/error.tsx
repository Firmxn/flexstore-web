"use client";

import { useEffect } from "react";

// Error boundary untuk seluruh route di bawah root layout. Dipakai ketika
// render gagal - misalnya database tidak dapat dijangkau. Pesan ke pengguna
// sengaja generik; detailnya hanya dicatat ke console (lihat SDD section 10).
//
// `retry` me-render ulang children sekaligus mengambil data baru, sedangkan
// `reset` hanya membersihkan state boundary. Untuk kegagalan pengambilan data,
// `retry` yang benar.
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("[app] render gagal", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="text-sm font-semibold text-muted-foreground">
        Terjadi kesalahan
      </p>
      <h1 className="text-2xl font-bold tracking-tight">
        Halaman gagal dimuat
      </h1>
      <p className="text-sm text-muted-foreground">
        Ada gangguan saat memuat halaman ini. Silakan coba lagi sebentar lagi.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-2 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Coba lagi
      </button>
    </div>
  );
}
