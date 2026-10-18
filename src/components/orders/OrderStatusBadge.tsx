import type { OrderStatus } from "@prisma/client";
import { ORDER_STATUS_LABELS } from "@/lib/orders/status";

// SITE-07 (PH-11, TASK-124, keputusan pengguna 2026-10-18): warna status
// memakai token CSS variables agar mengikuti palet brand. Merah = destructive,
// hijau = success, kuning/oranye (menunggu tindakan) = warning, biru/indigo
// (sedang diproses/dikirim) = info. Pola tint: bg token/10 teks token.
const STATUS_COLORS: Record<OrderStatus, string> = {
  WAITING_PAYMENT: "bg-warning/10 text-warning-strong",
  PROCESSING: "bg-info/10 text-info",
  SHIPPED: "bg-info/10 text-info",
  COMPLETED: "bg-success/10 text-success",
  CANCEL_REQUESTED: "bg-warning/10 text-warning-strong",
  CANCELED: "bg-destructive/10 text-destructive",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[status]}`}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
