"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils/format";

type CartSummaryProps = {
  subtotal: number;
  itemCount: number;
  variantIds: string[];
};

// Ringkasan keranjang. Subtotal dan jumlah item mengikuti item yang dicentang.
// Ongkir TIDAK dihitung di sini: pemilihan kecamatan + kurir dilakukan di
// /checkout (revisi PH-03, docs/04 bagian 6.8).
export function CartSummary({
  subtotal,
  itemCount,
  variantIds,
}: CartSummaryProps) {
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
      </dl>

      {variantIds.length > 0 ? (
        <Link href={checkoutHref} className={buttonVariants({ className: "w-full" })}>
          Checkout ({itemCount} item)
        </Link>
      ) : (
        <Button type="button" disabled className="w-full">
          Pilih item untuk checkout
        </Button>
      )}
    </div>
  );
}
