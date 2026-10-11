import Link from "next/link";
import { connection } from "next/server";
import { PageContainer } from "@/components/layout/PageContainer";
import { OrderListItem } from "@/components/orders/OrderListItem";
import { requireCustomerPage } from "@/lib/auth/session";
import { getOrdersForUser } from "@/lib/orders";

export const metadata = { title: "Pesanan Saya" };

// ORDER-03: riwayat pesanan customer. Membaca sesi, jadi request-time.
export const instant = false;

export default async function OrdersPage() {
  await connection();

  const user = await requireCustomerPage();
  const orders = await getOrdersForUser(user.id);

  return (
    <PageContainer>
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
            <OrderListItem key={order.id} order={order} />
          ))}
        </ul>
      )}
    </PageContainer>
  );
}
