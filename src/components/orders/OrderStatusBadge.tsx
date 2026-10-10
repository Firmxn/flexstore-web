import type { OrderStatus } from "@prisma/client";
import { ORDER_STATUS_LABELS } from "@/lib/orders/status";

const STATUS_COLORS: Record<OrderStatus, string> = {
  WAITING_PAYMENT: "bg-amber-100 text-amber-900",
  PROCESSING: "bg-blue-100 text-blue-900",
  SHIPPED: "bg-indigo-100 text-indigo-900",
  COMPLETED: "bg-green-100 text-green-900",
  CANCELED: "bg-red-100 text-red-900",
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
