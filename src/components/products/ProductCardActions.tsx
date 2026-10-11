"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";

// Tombol aksi pada kartu katalog: "Keranjang" menambah ke keranjang, "Beli"
// menambah lalu langsung membuka checkout dengan item itu terpilih. Varian yang
// dipakai adalah varian pertama yang stoknya tersedia (pemilihan varian detail
// ada di halaman produk).
export function ProductCardActions({ variantId }: { variantId: string | null }) {
  const router = useRouter();
  const [pending, setPending] = useState<"cart" | "buy" | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!variantId) {
    return (
      <Button variant="secondary" className="w-full" disabled>
        Stok habis
      </Button>
    );
  }

  function addToCart(): Promise<unknown> {
    return apiRequest("/api/cart", {
      method: "POST",
      body: JSON.stringify({ variantId, quantity: 1 }),
    });
  }

  async function handleCart() {
    setError(null);
    setPending("cart");
    try {
      await addToCart();
      router.refresh();
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setPending(null);
    }
  }

  async function handleBuy() {
    setError(null);
    setPending("buy");
    try {
      await addToCart();
      router.push(`/checkout?variantIds=${variantId}`);
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          disabled={pending !== null}
          onClick={handleCart}
        >
          {pending === "cart" ? "..." : "Keranjang"}
        </Button>
        <Button
          size="sm"
          className="flex-1"
          disabled={pending !== null}
          onClick={handleBuy}
        >
          {pending === "buy" ? "..." : "Beli"}
        </Button>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
