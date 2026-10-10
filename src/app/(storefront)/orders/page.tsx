import Link from "next/link";
import { connection } from "next/server";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { requireCustomerPage } from "@/lib/auth/session";
import { getOrdersForUser } from "@/lib/orders";
import { formatDateTime, formatRupiah } from "@/lib/utils/format";

export const metadata = { title: "Pesanan Saya" };

// ORDER-03: riwayat pesanan customer. Membaca sesi, jadi request-time.
export const instant = false;

export default async function OrdersPage() {
  await connection();

  const user = await requireCustomerPage();
  const orders = await getOrdersForUser(user.id);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Pesanan Saya</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-start gap-4 rounded-xl border border-dashed border-border p-8">
          <p className="text-sm text-muted-foreground">Belum ada pesanan.</p>
          <Link
            href="/products"
            className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Lihat produk
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-border rounded-xl border border-border bg-background">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/orders/${order.id}`}
                className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-accent/50"
              >
                <span className="flex flex-col gap-1">
                  <span className="font-medium">{order.orderNumber}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDateTime(order.createdAt)} - {order.items.length} item
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  <OrderStatusBadge status={order.status} />
                  <span className="font-semibold">
                    {formatRupiah(Number(order.total))}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
