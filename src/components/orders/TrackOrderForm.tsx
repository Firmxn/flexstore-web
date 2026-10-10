"use client";

import { useState } from "react";
import type { OrderStatus } from "@prisma/client";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";
import { formatDateTime, formatRupiah } from "@/lib/utils/format";

type TrackedOrder = {
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingCourier: string | null;
  shippingService: string | null;
  shippingEtd: string | null;
  shippingAddress: {
    name?: string;
    street?: string;
    city?: string;
    province?: string;
    postalCode?: string;
  } | null;
  items: {
    productName: string;
    variantName: string;
    sku: string;
    quantity: number;
    price: number;
  }[];
};

// ORDER-04: lacak pesanan publik (nomor pesanan + nomor HP). Server yang
// mencocokkan; pesan galat selalu generik supaya keberadaan pesanan tidak bocor.
export function TrackOrderForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setOrder(null);
    setSubmitting(true);
    try {
      const result = await apiRequest<{ order: TrackedOrder }>(
        "/api/orders/track",
        {
          method: "POST",
          body: JSON.stringify({ orderNumber, phone }),
        },
      );
      setOrder(result.order);
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6"
      >
        {error ? <Alert variant="destructive">{error}</Alert> : null}

        <div className="flex flex-col gap-2">
          <Label htmlFor="track-order-number">Nomor pesanan</Label>
          <Input
            id="track-order-number"
            required
            placeholder="FS-20261010-AB12CD"
            value={orderNumber}
            onChange={(event) => setOrderNumber(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="track-phone">Nomor HP</Label>
          <Input
            id="track-phone"
            required
            inputMode="tel"
            placeholder="08123456789"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Mencari..." : "Lacak Pesanan"}
        </Button>
      </form>

      {order ? (
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h2 className="font-semibold">{order.orderNumber}</h2>
              <p className="text-xs text-muted-foreground">
                {formatDateTime(order.createdAt)}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <ul className="flex flex-col divide-y divide-border text-sm">
            {order.items.map((item) => (
              <li
                key={`${item.sku}-${item.variantName}`}
                className="flex flex-wrap items-center justify-between gap-2 py-2"
              >
                <span className="flex flex-col">
                  <span className="font-medium">{item.productName}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.variantName} x{item.quantity}
                  </span>
                </span>
                <span>{formatRupiah(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <dl className="flex flex-col gap-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatRupiah(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Ongkos kirim</dt>
              <dd>{formatRupiah(order.shippingCost)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-semibold">
              <dt>Total</dt>
              <dd>{formatRupiah(order.total)}</dd>
            </div>
          </dl>

          {order.shippingAddress ? (
            <p className="text-xs text-muted-foreground">
              Kirim ke {order.shippingAddress.name} -{" "}
              {[order.shippingAddress.street, order.shippingAddress.city]
                .filter(Boolean)
                .join(", ")}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
