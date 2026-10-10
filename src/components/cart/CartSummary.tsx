"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ShippingPicker,
  type ShippingOption,
} from "@/components/shipping/ShippingPicker";
import { formatRupiah } from "@/lib/utils/format";

type CartSummaryProps = {
  subtotal: number;
  itemCount: number;
  variantIds: string[];
  shippingConfigured: boolean;
};

// Ringkasan keranjang. Subtotal dan jumlah item mengikuti item yang dicentang,
// dan estimasi ongkir dihitung hanya dari item itu (docs/04 bagian 6.1).
export function CartSummary({
  subtotal,
  itemCount,
  variantIds,
  shippingConfigured,
}: CartSummaryProps) {
  const [selected, setSelected] = useState<ShippingOption | null>(null);

  const total = subtotal + (selected?.cost ?? 0);
  const checkoutHref = `/checkout?variantIds=${encodeURIComponent(
    variantIds.join(","),
  )}`;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4">
      <h2 className="font-semibold">Ringkasan</h2>

      <dl className="flex flex-col gap-2 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">
            Subtotal ({itemCount} item dipilih)
          </dt>
          <dd>{formatRupiah(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Estimasi ongkir</dt>
          <dd>{selected ? formatRupiah(selected.cost) : "-"}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2 font-semibold">
          <dt>Total</dt>
          <dd>{formatRupiah(total)}</dd>
        </div>
      </dl>

      {variantIds.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Centang item yang ingin di-checkout.
        </p>
      ) : null}

      {variantIds.length > 0 ? (
        <Link href={checkoutHref} className={buttonVariants({ className: "w-full" })}>
          Checkout ({itemCount} item)
        </Link>
      ) : (
        <Button type="button" disabled className="w-full">
          Pilih item untuk checkout
        </Button>
      )}

      <div className="flex flex-col gap-3 border-t border-border pt-4">
        <h3 className="text-sm font-semibold">Estimasi Ongkos Kirim</h3>
        {/* key: pilihan ongkir direset saat daftar item terpilih berubah */}
        <ShippingPicker
          key={variantIds.join(",")}
          variantIds={variantIds}
          configured={shippingConfigured}
          onSelect={(option) => setSelected(option)}
        />
      </div>
    </div>
  );
}
