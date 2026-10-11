import Link from "next/link";
import { connection } from "next/server";
import { PageContainer } from "@/components/layout/PageContainer";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { TrackOrderForm } from "@/components/orders/TrackOrderForm";
import { getShopperUser } from "@/lib/auth/session";
import { getInTransitOrdersForUser } from "@/lib/orders";
import { formatDateTime } from "@/lib/utils/format";

export const metadata = { title: "Lacak Pesanan" };

// ORDER-08 (PH-06): customer melihat pesanan dalam perjalanan tanpa input data;
// guest tetap memakai form nomor pesanan + nomor HP.
export const instant = false;

export default async function TrackOrderPage() {
  await connection();

  const user = await getShopperUser();
  const inTransit = user ? await getInTransitOrdersForUser(user.id) : [];

  return (
    <PageContainer>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Lacak Pesanan</h1>
        <p className="text-sm text-muted-foreground">
          Masukkan nomor pesanan dan nomor HP yang dipakai saat checkout.
        </p>
      </div>

      {user ? (
        <section className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4">
          <h2 className="font-semibold">Pesanan Dalam Perjalanan</h2>
          {inTransit.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Tidak ada pesanan yang sedang diproses atau dikirim.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {inTransit.map((order) => (
                <li
                  key={order.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{order.orderNumber}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={order.status} />
                    <Link
                      href={`/orders/${order.id}/tracking`}
                      className="inline-flex h-9 items-center rounded-md border border-input px-3 text-sm hover:bg-accent"
                    >
                      Lacak
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      <TrackOrderForm />
    </PageContainer>
  );
}
