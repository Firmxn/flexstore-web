"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";
import { formatRupiah } from "@/lib/utils/format";

type VariantOption = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
};

export function AddToCartForm({ variants }: { variants: VariantOption[] }) {
  const router = useRouter();
  const firstAvailable = variants.find((variant) => variant.stock > 0);
  const [variantId, setVariantId] = useState(firstAvailable?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const selected = variants.find((variant) => variant.id === variantId);
  const maxQuantity = selected?.stock ?? 0;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!variantId) return;

    setError(null);
    setSuccess(false);
    setPending(true);

    try {
      await apiRequest("/api/cart", {
        method: "POST",
        body: JSON.stringify({ variantId, quantity }),
      });
      setSuccess(true);
      setQuantity(1);
      router.refresh();
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setPending(false);
    }
  }

  if (variants.length === 0) {
    return <p className="text-sm text-muted-foreground">Produk belum punya varian.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Pilihan Varian
        </h2>
        <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
          {variants.map((variant) => {
            const disabled = variant.stock <= 0;
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
                      name="variantId"
                      value={variant.id}
                      checked={variantId === variant.id}
                      disabled={disabled}
                      onChange={() => {
                        setVariantId(variant.id);
                        setQuantity(1);
                        setSuccess(false);
                      }}
                      className="h-4 w-4"
                    />
                    <span className="flex flex-col">
                      <span className="text-sm font-medium">{variant.name}</span>
                      <span className="text-xs text-muted-foreground">
                        SKU {variant.sku}
                      </span>
                    </span>
                  </span>
                  <span className="flex flex-col items-end">
                    <span className="text-sm font-semibold">
                      {formatRupiah(variant.price)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {disabled ? "Stok habis" : `Stok ${variant.stock}`}
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex items-end gap-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="quantity" className="text-sm font-medium">
            Jumlah
          </label>
          <Input
            id="quantity"
            type="number"
            min={1}
            max={Math.max(maxQuantity, 1)}
            value={quantity}
            onChange={(event) => {
              const value = Number(event.target.value);
              if (Number.isInteger(value) && value >= 1) setQuantity(value);
            }}
            className="w-24"
            disabled={!selected || pending}
          />
        </div>
        <Button
          type="submit"
          disabled={!selected || pending || maxQuantity <= 0}
          className="h-10 flex-1"
        >
          {pending ? "Menambahkan..." : "Tambah ke Keranjang"}
        </Button>
      </div>

      {maxQuantity > 0 && quantity >= maxQuantity ? (
        <p className="text-xs text-muted-foreground">
          Maksimal {maxQuantity} item sesuai stok tersedia.
        </p>
      ) : null}

      {error ? <Alert variant="destructive">{error}</Alert> : null}
      {success ? (
        <Alert variant="success">
          Ditambahkan ke keranjang. Lihat halaman keranjang untuk checkout.
        </Alert>
      ) : null}
    </form>
  );
}
