"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";
import {
  VariantPickerDialog,
  stokEfektif,
  type CardVariantOption,
} from "./VariantPickerDialog";

// Tombol aksi pada kartu katalog: "Keranjang" menambah ke keranjang, "Beli"
// menambah lalu langsung membuka checkout dengan item itu terpilih (CART-01).
// Bila produk punya lebih dari satu varian dengan stok efektif, klik membuka
// dialog pemilihan varian dulu (CART-05, permintaan pengguna 2026-10-15); satu
// varian berstok tetap langsung, tanpa dialog.
//
// Stok efektif (perbaikan 2026-10-15, TASK-114): kartu menilai
// `stock - keranjang` — kuantitas varian yang sudah di keranjang pembeli
// disertakan saat render. Tiga keadaan tombol:
// 1. stok gudang kosong semua → "Stok habis" (disabled);
// 2. stok gudang ada tapi semua sudah di keranjang → satu tombol "Keranjang";
//    klik tidak menambah apa pun, hanya menuju halaman keranjang dengan
//    highlight baris varian (keputusan pengguna: tanpa dialog tambahan);
// 3. selain itu → Keranjang/Beli seperti biasa.
export function ProductCardActions({
  productName,
  productHref,
  coverUrl,
  hasSizeChart,
  variants,
}: {
  productName: string;
  productHref: string;
  coverUrl: string | null;
  hasSizeChart: boolean;
  variants: CardVariantOption[];
}) {
  const router = useRouter();
  const tersedia = variants.filter((variant) => stokEfektif(variant) > 0);
  const langsung = tersedia.length === 1;
  const stokHabis = variants.every((variant) => variant.stock <= 0);
  const penuhDiKeranjang = !stokHabis && tersedia.length === 0;
  const [pending, setPending] = useState<"cart" | "buy" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  // Kunci per pembukaan: dialog diremount saat dibuka ulang, jadi pilihan kembali
  // ke varian pertama yang stoknya tersedia (konsisten AddToCartForm). Reset lewat
  // key, bukan setState di dalam effect (aturan lint react-hooks).
  const [dialogKey, setDialogKey] = useState(0);

  if (stokHabis) {
    return (
      <Button variant="secondary" className="w-full" disabled>
        Stok habis
      </Button>
    );
  }

  if (penuhDiKeranjang) {
    const hilite = variants
      .filter((variant) => variant.keranjang > 0)
      .map((variant) => variant.id)
      .join(",");
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => router.push(`/cart?hilite=${hilite}`)}
      >
        Keranjang
      </Button>
    );
  }

  function addToCart(variantId: string): Promise<unknown> {
    return apiRequest("/api/cart", {
      method: "POST",
      body: JSON.stringify({ variantId, quantity: 1 }),
    });
  }

  async function jalankan(variantId: string, aksi: "cart" | "buy") {
    setError(null);
    setPending(aksi);
    try {
      await addToCart(variantId);
      if (aksi === "buy") {
        router.push(`/checkout?variantIds=${variantId}`);
      } else {
        setDialogOpen(false);
        router.refresh();
      }
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setPending(null);
    }
  }

  function pilih(aksi: "cart" | "buy") {
    if (langsung) return jalankan(tersedia[0].id, aksi);
    setError(null);
    setDialogKey((key) => key + 1);
    setDialogOpen(true);
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          disabled={pending !== null}
          onClick={() => pilih("cart")}
        >
          {pending === "cart" ? "..." : "Keranjang"}
        </Button>
        <Button
          size="sm"
          className="flex-1"
          disabled={pending !== null}
          onClick={() => pilih("buy")}
        >
          {pending === "buy" ? "..." : "Beli"}
        </Button>
      </div>
      {langsung ? (
        error ? (
          <Alert variant="destructive" className="px-3 py-2 text-xs">
            {error}
          </Alert>
        ) : null
      ) : (
        <VariantPickerDialog
          key={dialogKey}
          open={dialogOpen}
          onOpenChange={(next) => {
            setDialogOpen(next);
            if (!next) setError(null);
          }}
          productName={productName}
          productHref={productHref}
          coverUrl={coverUrl}
          hasSizeChart={hasSizeChart}
          variants={variants}
          pending={pending}
          error={error}
          onCart={(variantId) => jalankan(variantId, "cart")}
          onBuy={(variantId) => jalankan(variantId, "buy")}
        />
      )}
    </div>
  );
}
