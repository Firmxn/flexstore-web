import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronRight, Package } from "lucide-react";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { ReorderButton } from "./ReorderButton";
import type { getOrdersForUser } from "@/lib/orders";
import { formatDateTime, formatRupiah } from "@/lib/utils/format";

type OrdersList = Awaited<ReturnType<typeof getOrdersForUser>>;
export type OrderRow = OrdersList[number];

// Tombol aksi masih placeholder (tanpa handler): "Lacak Pesanan" milik
// ORDER-08 (PH-06) — nanti mengarah ke detail tracking per pesanan yang
// session-scoped, bukan ke form /track-order; "Batalkan Pesanan" milik
// ORDER-05 (PH-06, cancel/refund). Status tombol dibatasi supaya tidak muncul
// di pesanan yang sudah selesai atau dibatalkan.
const TRACKABLE_STATUSES: OrderRow["status"][] = [
  "PROCESSING",
  "SHIPPED",
  "COMPLETED",
];
const CANCELABLE_STATUSES: OrderRow["status"][] = [
  "WAITING_PAYMENT",
  "PROCESSING",
];

// Baris item selalu setara: pesanan dengan satu produk hanya punya satu baris,
// pesanan multi-produk menampilkan baris pertama lalu sisanya di balik
// <details> native (tetap Server Component). Summary harus anak pertama details
// agar valid HTML, dan flex-col-reverse menaruhnya di bawah daftar — posisi
// "Selengkapnya"/"Tampilkan lebih sedikit" selalu di bawah seperti referensi.
// Toggle-nya sibling dari <Link>, bukan anak, karena elemen interaktif di
// dalam <a> itu invalid.
function ItemRow({ item }: { item: OrderRow["items"][number] }) {
  const image = item.variant.product.images[0]?.url;

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
        {image ? (
          <Image
            src={image}
            alt={item.productName}
            fill
            sizes="40px"
            className="object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Package className="h-4 w-4" aria-hidden />
          </span>
        )}
      </div>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium">{item.productName}</span>
        <span className="truncate text-xs text-muted-foreground">
          {item.variantName}
        </span>
      </span>
      <span className="shrink-0 text-xs text-muted-foreground">
        x{item.quantity}
      </span>
      <span className="shrink-0 text-sm font-semibold">
        {formatRupiah(Number(item.price) * item.quantity)}
      </span>
    </div>
  );
}

export function OrderListItem({ order }: { order: OrderRow }) {
  const firstItem = order.items[0];
  const rest = order.items.slice(1);
  const itemCount = order.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const canTrack = TRACKABLE_STATUSES.includes(order.status);
  const canCancel = CANCELABLE_STATUSES.includes(order.status);

  return (
    <li className="p-4 transition-colors hover:bg-accent/50">
      <Link
        href={`/orders/${order.id}`}
        className="group flex items-center justify-between gap-4"
      >
        <span className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-xs text-muted-foreground">
            {order.orderNumber}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDateTime(order.createdAt)} · {itemCount} item
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <span className="font-semibold">
            {formatRupiah(Number(order.total))}
          </span>
          <ChevronRight
            className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </span>
      </Link>

      <div className="mt-3 flex flex-col gap-3 border-t border-border pt-3">
        {firstItem ? <ItemRow item={firstItem} /> : null}

        {rest.length > 0 ? (
          <details className="group flex flex-col-reverse">
            <summary className="inline-flex w-fit cursor-pointer list-none items-center gap-1 text-xs text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
              <ChevronDown
                className="h-3.5 w-3.5 transition-transform group-open:rotate-180"
                aria-hidden
              />
              <span className="group-open:hidden">Selengkapnya</span>
              <span className="hidden group-open:inline">
                Tampilkan lebih sedikit
              </span>
            </summary>
            <ul className="mb-3 flex flex-col gap-3">
              {rest.map((item) => (
                <li key={item.id}>
                  <ItemRow item={item} />
                </li>
              ))}
            </ul>
          </details>
        ) : null}

        {canTrack || canCancel ? (
          <div className="flex flex-wrap items-center justify-end gap-2">
            {canTrack ? (
              <Link
                href={`/orders/${order.id}/tracking`}
                className="inline-flex h-9 items-center rounded-md border border-input px-3 text-sm font-medium hover:bg-accent"
              >
                Lacak Pesanan
              </Link>
            ) : null}
            {canCancel ? (
              <Link
                href={`/orders/${order.id}`}
                className="inline-flex h-9 items-center rounded-md border border-input px-3 text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                Batalkan Pesanan
              </Link>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-end gap-2">
          <ReorderButton orderId={order.id} />
        </div>
      </div>
    </li>
  );
}
