"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormErrorAlert } from "@/components/ui/form-error-alert";
import { formatRupiah } from "@/lib/utils/format";

// CART-05 (permintaan pengguna 2026-10-15): dialog pemilihan varian dari kartu
// produk. Isinya sesimpel nama produk, gambar, dan daftar varian — detail
// selengkapnya (bagan ukuran, deskripsi) dibuka lewat tautan bergaya BackLink
// ke halaman detail, bukan diduplikasi di dalam dialog.
//
// Baris varian dinilai dengan stok efektif (perbaikan 2026-10-15, TASK-114):
// habis stok gudang = "Stok habis"; semua unitnya sudah di keranjang pembeli =
// "Sudah di keranjang" (perbaiki klik ditolak setelahnya).
export type CardVariantOption = {
  id: string;
  name: string;
  price: number;
  stock: number;
  keranjang: number;
};

export function stokEfektif(variant: CardVariantOption): number {
  return variant.stock - variant.keranjang;
}

export function VariantPickerDialog({
  open,
  onOpenChange,
  productName,
  productHref,
  coverUrl,
  hasSizeChart,
  variants,
  pending,
  error,
  onCart,
  onBuy,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  productHref: string;
  coverUrl: string | null;
  hasSizeChart: boolean;
  variants: CardVariantOption[];
  pending: "cart" | "buy" | null;
  error: string | null;
  onCart: (variantId: string) => void;
  onBuy: (variantId: string) => void;
}) {
  const defaultVariantId =
    variants.find((variant) => stokEfektif(variant) > 0)?.id ?? "";
  const [variantId, setVariantId] = useState(defaultVariantId);
  const selected = variants.find((variant) => variant.id === variantId);
  const selectedTersedia = selected ? stokEfektif(selected) > 0 : false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Pilih Varian</DialogTitle>
          <DialogDescription>
            Pilih varian untuk {productName} sebelum masuk keranjang.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3">
          {coverUrl ? (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
              <Image
                src={coverUrl}
                alt={productName}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          ) : null}
          <div className="min-w-0">
            <p className="line-clamp-2 text-sm font-semibold">{productName}</p>
            <p className="text-sm text-muted-foreground">
              {selected && selectedTersedia
                ? formatRupiah(selected.price)
                : "Pilih varian dulu"}
            </p>
          </div>
        </div>

        <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
          {variants.map((variant) => {
            const efektif = stokEfektif(variant);
            const disabled = efektif <= 0;
            return (
              <li key={variant.id}>
                <label
                  className={`flex items-center justify-between gap-4 px-4 py-3 ${
                    disabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:bg-accent/50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="variant-card-picker"
                      value={variant.id}
                      checked={variantId === variant.id}
                      disabled={disabled}
                      onChange={() => setVariantId(variant.id)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm font-medium">{variant.name}</span>
                  </span>
                  <span className="flex flex-col items-end">
                    <span className="text-sm font-semibold">
                      {formatRupiah(variant.price)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {variant.stock <= 0
                        ? "Stok habis"
                        : efektif <= 0
                          ? "Sudah di keranjang"
                          : `Stok ${efektif}`}
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            disabled={!selectedTersedia || pending !== null}
            onClick={() => selected && selectedTersedia && onCart(selected.id)}
          >
            {pending === "cart" ? "..." : "Keranjang"}
          </Button>
          <Button
            className="flex-1"
            disabled={!selectedTersedia || pending !== null}
            onClick={() => selected && selectedTersedia && onBuy(selected.id)}
          >
            {pending === "buy" ? "..." : "Beli"}
          </Button>
        </div>

        <FormErrorAlert message={error} />

        {hasSizeChart ? (
          <Link
            href={productHref}
            className="w-fit text-sm text-muted-foreground hover:underline"
          >
            Lihat bagan ukuran &amp; detail lengkap
          </Link>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
