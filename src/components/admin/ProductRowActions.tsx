"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";

// Aksi baris tabel produk admin. Ubah dan Hapus sejajar di baris pertama;
// pesan galat penolakan hapus (mis. produk masih di keranjang) dirender
// di bawah keduanya dengan lebar penuh kolom, bukan di bawah satu tombol.
export function ProductRowActions({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Hapus produk "${productName}"?`)) return;

    setError(null);
    setSubmitting(true);

    try {
      await apiRequest(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      router.refresh();
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-1">
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
          disabled={submitting}
          onClick={handleDelete}
          className="text-destructive hover:bg-destructive/10"
        >
          {submitting ? "Menghapus..." : "Hapus"}
        </Button>
      </div>
      {error ? <Alert variant="destructive" className="py-1.5 text-xs">{error}</Alert> : null}
    </div>
  );
}
