"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";

// Tombol hapus dengan konfirmasi dialog aplikasi (docs/03 bagian 1B) —
// galat penghapusan tampil di dalam dialog, bukan di bawah tombol.
export function DeleteButton({
  url,
  confirmTitle,
  confirmDescription = "Data yang dihapus tidak bisa dikembalikan.",
  successRedirect,
  label = "Hapus",
}: {
  url: string;
  confirmTitle: string;
  confirmDescription?: string;
  successRedirect?: string;
  label?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleConfirm() {
    try {
      await apiRequest(url, { method: "DELETE" });
    } catch (caught) {
      throw new Error(toErrorMessage(caught));
    }

    if (successRedirect) router.push(successRedirect);
    router.refresh();
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-destructive hover:bg-destructive/10"
      >
        {label}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={confirmTitle}
        description={confirmDescription}
        confirmLabel={label}
        onConfirm={handleConfirm}
      />
    </>
  );
}
