"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { ShoppingCart } from "lucide-react";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";
import { formatRupiah } from "@/lib/utils/format";
import {
  VariantPickerDialog,
  stokEfektif,
  type CardVariantOption,
} from "./VariantPickerDialog";

// Tombol aksi pada kartu katalog: hanya "Keranjang" sebagai ikon minimalis
// di sebelah kanan (permintaan pengguna 2026-10-16). Tombol "Beli" dihapus.
//
// Stok efektif (perbaikan 2026-10-15, TASK-114): kartu menilai
// `stock - keranjang` — kuantitas varian yang sudah di keranjang pembeli
// disertakan saat render. Tiga keadaan tombol:
// 1. stok gudang kosong semua → ikon keranjang disabled ("Stok habis");
// 2. stok gudang ada tapi semua sudah di keranjang → satu ikon keranjang;
//    klik tidak menambah apa pun, hanya menuju halaman keranjang dengan
//    highlight baris varian (keputusan pengguna: tanpa dialog tambahan);
// 3. selain itu → ikon keranjang aktif (langsung atau lewat dialog varian).
//
// canShop = false (role non-customer, mis. admin — `getCartAccess` gagal):
// tombol tetap dirender dalam keadaan disabled di seluruh keadaan di atas,
// pengganti perilaku lama yang menyembunyikan blok aksi dari kartu
// (keputusan pengguna 2026-10-16).
export function ProductCardActions({
  canShop,
  productName,
  productHref,
  coverUrl,
  hasInfo,
  infoLabel,
  price,
  variants,
}: {
  canShop: boolean;
  productName: string;
  productHref: string;
  coverUrl: string | null;
  hasInfo: boolean;
  infoLabel: string;
  price: number;
  variants: CardVariantOption[];
}) {
  const router = useRouter();
  const tersedia = variants.filter((variant) => stokEfektif(variant) > 0);
  const langsung = tersedia.length === 1;
  const stokHabis = variants.every((variant) => variant.stock <= 0);
  const penuhDiKeranjang = !stokHabis && tersedia.length === 0;
  const [pending, setPending] = useState<"cart" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  // Kunci per pembukaan: dialog diremount saat dibuka ulang, jadi pilihan kembali
  // ke varian pertama yang stoknya tersedia (konsisten AddToCartForm). Reset lewat
  // key, bukan setState di dalam effect (aturan lint react-hooks).
  const [dialogKey, setDialogKey] = useState(0);

  if (stokHabis) {
    return (
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{formatRupiah(price)}</span>
        <Button
          variant="outline"
          size="icon"
          disabled
          aria-label="Stok habis"
          title="Stok habis"
          className="size-9 rounded-lg opacity-50 cursor-not-allowed"
        >
          <ShoppingCart className="size-4" />
        </Button>
      </div>
    );
  }

  if (penuhDiKeranjang) {
    const hilite = variants
      .filter((variant) => variant.keranjang > 0)
      .map((variant) => variant.id)
      .join(",");
    return (
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{formatRupiah(price)}</span>
        <Button
          variant="outline"
          size="icon"
          disabled={!canShop}
          onClick={() => router.push(`/cart?hilite=${hilite}`)}
          aria-label="Lihat keranjang"
          title="Lihat keranjang"
          className="size-9 rounded-lg"
        >
          <ShoppingCart className="size-4" />
        </Button>
      </div>
    );
  }

  function addToCart(variantId: string): Promise<unknown> {
    return apiRequest("/api/cart", {
      method: "POST",
      body: JSON.stringify({ variantId, quantity: 1 }),
    });
  }

  async function keranjang(variantId: string) {
    setError(null);
    setPending("cart");
    try {
      await addToCart(variantId);
      setDialogOpen(false);
      router.refresh();
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setPending(null);
    }
  }

  function pilih() {
    if (langsung) return keranjang(tersedia[0].id);
    setError(null);
    setDialogKey((key) => key + 1);
    setDialogOpen(true);
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{formatRupiah(price)}</span>
        <Button
          variant="outline"
          size="icon"
          disabled={pending !== null || !canShop}
          onClick={pilih}
          aria-label={
            pending === "cart"
              ? "Menambahkan ke keranjang"
              : "Tambah ke keranjang"
          }
          title={
            pending === "cart" ? "Menambahkan..." : "Tambah ke keranjang"
          }
          className="size-9 rounded-lg"
        >
          <ShoppingCart className="size-4" />
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
          hasInfo={hasInfo}
          infoLabel={infoLabel}
          variants={variants}
          pending={pending}
          error={error}
          onCart={(variantId) => keranjang(variantId)}
          onBuy={() => {}}
        />
      )}
    </div>
  );
}
