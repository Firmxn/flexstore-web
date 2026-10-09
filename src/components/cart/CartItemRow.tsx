"use client";

import { useState } from "react";
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
  sku: string;
  imageUrl: string | null;
  price: number;
  quantity: number;
  stock: number;
  available: boolean;
};

export function CartItemRow({
  variantId,
  productName,
  productSlug,
  variantName,
  sku,
  imageUrl,
  price,
  quantity,
  stock,
  available,
}: CartItemRowProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <li className="flex flex-col gap-3 border-b border-border p-4 last:border-b-0">
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
          <p className="text-xs text-muted-foreground">
            {variantName} - SKU {sku}
          </p>
          <p className="text-sm">{formatRupiah(price)}</p>
          {!available ? (
            <p className="text-xs text-destructive">
              Produk tidak tersedia. Hapus item ini untuk melanjutkan.
            </p>
          ) : null}
        </div>

        <div className="flex flex-col items-end justify-between gap-2">
          <p className="font-semibold">{formatRupiah(price * quantity)}</p>
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
    </li>
  );
}
