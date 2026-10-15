"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";

// Aksi baris tabel produk admin. Ubah dan Hapus sejajar di baris pertama;
// konfirmasi hapus memakai dialog aplikasi (docs/03 bagian 1B) dan galat
// penolakan (mis. produk masih di keranjang / sudah pernah dipesan) tampil
// di dalam dialog tersebut.
export function ProductRowActions({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleConfirm() {
    try {
      await apiRequest(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
    } catch (caught) {
      throw new Error(toErrorMessage(caught));
    }
    router.refresh();
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Link
          href={`/admin/products/${productId}/edit`}
          className="inline-flex h-9 items-center rounded-md border border-input px-3 text-sm hover:bg-accent"
        >
          Ubah
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(true)}
          className="text-destructive hover:bg-destructive/10"
        >
          Hapus
        </Button>
      </div>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`Hapus produk "${productName}"?`}
        description="Produk beserta galerinya akan dihapus permanen dan tidak bisa dikembalikan."
        confirmLabel="Hapus"
        onConfirm={handleConfirm}
      />
    </>
  );
}
