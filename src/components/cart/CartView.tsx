"use client";

import { useMemo, useState } from "react";
import type { CartLine } from "@/lib/cart";
import { CartItemRow } from "./CartItemRow";
import { CartSummary } from "./CartSummary";

type CartViewProps = {
  items: CartLine[];
};

// Pemilihan item untuk checkout. State hanya hidup di komponen ini (tidak
// disimpan ke server) dan default kosong: pengguna yang menentukan item mana
// yang di-checkout (catatan review PH-02, docs/04 bagian 6.1). Ongkir dihitung
// di /checkout, bukan di sini.
export function CartView({ items }: CartViewProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const selectedLines = useMemo(
    () => items.filter((item) => selected.has(item.variantId)),
    [items, selected],
  );
  const subtotal = selectedLines.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const itemCount = selectedLines.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  function toggle(variantId: string, next: boolean) {
    setSelected((current) => {
      const copy = new Set(current);
      if (next) copy.add(variantId);
      else copy.delete(variantId);
      return copy;
    });
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
      <ul className="rounded-xl border border-border bg-background">
        {items.map((item) => (
          <CartItemRow
            key={item.variantId}
            variantId={item.variantId}
            productName={item.productName}
            productSlug={item.productSlug}
            variantName={item.variantName}
            sku={item.sku}
            imageUrl={item.imageUrl}
            price={item.price}
            quantity={item.quantity}
            stock={item.stock}
            available={item.productStatus === "ACTIVE"}
            selected={selected.has(item.variantId)}
            onSelectChange={(next) => toggle(item.variantId, next)}
          />
        ))}
      </ul>

      <CartSummary
        subtotal={subtotal}
        itemCount={itemCount}
        variantIds={selectedLines.map((item) => item.variantId)}
      />
    </div>
  );
}
