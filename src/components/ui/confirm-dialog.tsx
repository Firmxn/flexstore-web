"use client";

import { useState } from "react";
import { FormErrorAlert } from "./form-error-alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";

// Aturan global docs/03 bagian 1B: seluruh pesan konfirmasi destruktif memakai
// dialog aplikasi shadcn AlertDialog (bukan `window.confirm` bawaan browser)
// supaya tampilan selaras dengan sistem UI. Isi standar: judul menyebut
// tindakan, deskripsi satu kalimat konsekuensi, tombol "Batal" + aksi
// destruktif; tombol aksi nonaktif berlabel "Memproses..." selama permintaan
// berjalan dan galat tampil di dalam dialog lewat pola `FormErrorAlert`.
// Escape dan klik latar = batal, tetapi selama permintaan berjalan dialog
// dikunci supaya aksi tidak terputus.
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Hapus",
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  // Melempar Error berisi pesan pengguna bila gagal — pesan itu yang tampil
  // di dialog; bila selesai tanpa lemparan, dialog menutup sendiri.
  onConfirm: () => Promise<void>;
}) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleOpenChange(next: boolean) {
    if (processing) return;
    if (!next) setError(null);
    onOpenChange(next);
  }

  async function handleConfirm() {
    setError(null);
    setProcessing(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (caught) {
      setError(
        caught instanceof Error && caught.message
          ? caught.message
          : "Terjadi kesalahan, coba lagi",
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <FormErrorAlert message={error} />

        <AlertDialogFooter>
          <AlertDialogCancel disabled={processing}>Batal</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={processing}
            // Cegah penutupan bawaan Radix — dialog baru ditutup setelah
            // permintaan sukses; kegagalan membiarkan dialog terbuka.
            onClick={(event) => {
              event.preventDefault();
              void handleConfirm();
            }}
          >
            {processing ? "Memproses..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
