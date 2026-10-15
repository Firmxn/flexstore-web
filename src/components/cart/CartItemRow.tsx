"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";
import { formatRupiah } from "@/lib/utils/format";

type CartItemRowProps = {
  variantId: string;
  productName: string;
  productSlug: string;
  variantName: string;
  imageUrl: string | null;
  price: number;
  quantity: number;
  stock: number;
  available: boolean;
  selected: boolean;
  // CART-05 (TASK-114): baris di-highlight (latar + cincin + di-gulir ke
  // pandangan) bila varian ini masuk `?hilite=` halaman keranjang.
  highlighted?: boolean;
  onSelectChange: (selected: boolean) => void;
};

export function CartItemRow({
  variantId,
  productName,
  productSlug,
  variantName,
  imageUrl,
  price,
  quantity,
  stock,
  available,
  selected,
  highlighted = false,
  onSelectChange,
}: CartItemRowProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rowRef = useRef<HTMLLIElement | null>(null);

  // Gulir sekali saat baris muncul dengan highlight (tanpa setState — aman
  // aturan lint react-hooks).
  useEffect(() => {
    if (highlighted && rowRef.current) {
      rowRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlighted]);

  async function mutate(
    request: () => Promise<unknown>,
  ): Promise<void> {
    setError(null);
    setPending(true);
    try {
      await request();
      router.refresh();
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setPending(false);
    }
  }

  function updateQuantity(nextQuantity: number) {
    return mutate(() =>
      apiRequest("/api/cart", {
        method: "PATCH",
        body: JSON.stringify({ variantId, quantity: nextQuantity }),
      }),
    );
  }

  function remove() {
    return mutate(() =>
      apiRequest("/api/cart", {
        method: "DELETE",
        body: JSON.stringify({ variantId }),
      }),
    );
  }

  return (
    <li
      ref={rowRef}
      className={`flex gap-4 border-b border-border p-4 last:border-b-0 ${
        highlighted
          ? "bg-accent/40 shadow-[inset_0_0_0_2px_hsl(var(--primary))]"
          : ""
      }`}
    >
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 shrink-0"
        checked={selected}
        disabled={!available}
        onChange={(event) => onSelectChange(event.target.checked)}
        aria-label={`Pilih ${productName} ${variantName}`}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={productName}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                Tanpa gambar
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Link
              href={`/products/${productSlug}`}
              className="truncate font-medium hover:underline"
            >
              {productName}
            </Link>
            <p className="text-xs text-muted-foreground">{variantName}</p>
            {!available ? (
              <p className="text-xs text-destructive">
                Produk tidak tersedia. Hapus item ini untuk melanjutkan.
              </p>
            ) : null}
          </div>

          <div className="flex flex-col items-end justify-between gap-2">
            <p className="font-semibold">{formatRupiah(price)}</p>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={pending || !available || quantity <= 1}
                onClick={() => updateQuantity(quantity - 1)}
                aria-label="Kurangi jumlah"
              >
                -
              </Button>
              <span className="w-8 text-center text-sm">{quantity}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={pending || !available || quantity >= stock}
                onClick={() => updateQuantity(quantity + 1)}
                aria-label="Tambah jumlah"
              >
                +
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            {available ? `Stok tersedia ${stock}` : "Stok tidak tersedia"}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={pending}
            onClick={remove}
            className="text-destructive hover:text-destructive"
          >
            {pending ? "Memproses..." : "Hapus"}
          </Button>
        </div>

        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>
    </li>
  );
}
