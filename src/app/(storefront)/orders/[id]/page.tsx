import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { PageContainer } from "@/components/layout/PageContainer";
import { GuestOrderNotice } from "@/components/orders/GuestOrderNotice";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { PaymentDeadline } from "@/components/orders/PaymentDeadline";
import { PaymentStatusWatcher } from "@/components/payments/PaymentStatusWatcher";
import { PayNowButton } from "@/components/payments/PayNowButton";
import { getShopperUser } from "@/lib/auth/session";
import {
  getGuestAccessPhone,
  getGuestOrderDetail,
  getOrderDetail,
} from "@/lib/orders";
import { reconcilePaymentForOrder } from "@/lib/payments";
import { formatDateTime, formatRupiah } from "@/lib/utils/format";

export const metadata = { title: "Detail Pesanan" };

export const instant = false;

type AddressJson = {
  name?: string;
  phone?: string;
  street?: string;
  city?: string;
  province?: string;
  district?: string;
  subdistrict?: string;
  postalCode?: string;
  note?: string;
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();

  const { id } = await params;

  // Satu halaman untuk guest dan customer. Customer lewat sesi; guest lewat
  // cookie bertanda-tangan tanpa login. Query mengembalikan null untuk pesanan
  // milik orang lain atau ID bukan UUID, sehingga keduanya jadi 404
  // (AC-ORDER-02-04). Role non-customer diarahkan ke area admin.
  const user = await getShopperUser();
  const guestPhone = user ? null : await getGuestAccessPhone();

  const loadOrder = () =>
    user
      ? getOrderDetail(user.id, id)
      : guestPhone
        ? getGuestOrderDetail(id, guestPhone)
        : Promise.resolve(null);

  let order = await loadOrder();
  if (!order) notFound();

  // Jaring pengaman webhook: kalau pembayaran sudah dimulai tapi webhook belum
  // sampai, tanyakan status terkini ke Xendit lalu muat ulang pesanan.
  if (order.status === "WAITING_PAYMENT" && order.payment) {
    const reconciled = await reconcilePaymentForOrder(order.id);
    if (reconciled.ok && reconciled.changed) {
      order = (await loadOrder()) ?? order;
    }
  }

  const address = (order.shippingAddress ?? {}) as AddressJson;

  return (
    <PageContainer>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {order.orderNumber}
          </h1>
          <p className="text-sm text-muted-foreground">
            {formatDateTime(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {!user ? (
        <GuestOrderNotice
          orderNumber={order.orderNumber}
          phone={order.guestPhone ?? null}
        />
      ) : null}

      <section className="rounded-xl border border-border bg-background p-4">
        <h2 className="mb-3 font-semibold">Item</h2>
        <ul className="flex flex-col divide-y divide-border text-sm">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 py-2"
            >
              <span className="flex flex-col">
                <span className="font-medium">{item.productName}</span>
                <span className="text-xs text-muted-foreground">
                  {item.variantName} - SKU {item.sku} x{item.quantity}
                </span>
              </span>
              <span>{formatRupiah(Number(item.price) * item.quantity)}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        <section className="rounded-xl border border-border bg-background p-4 text-sm">
          <h2 className="mb-3 font-semibold">Alamat Pengiriman</h2>
          <p className="font-medium">{address.name}</p>
          <p className="text-muted-foreground">{address.phone}</p>
          <p className="text-muted-foreground">{address.street}</p>
          <p className="text-muted-foreground">
            {[
              address.subdistrict,
              address.district,
              address.city,
              address.province,
              address.postalCode,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>
          {address.note ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Catatan: {address.note}
            </p>
          ) : null}
        </section>

        <section className="rounded-xl border border-border bg-background p-4 text-sm">
          <h2 className="mb-3 font-semibold">Pembayaran</h2>
          <dl className="flex flex-col gap-2">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatRupiah(Number(order.subtotal))}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                Ongkos kirim
                {order.shippingService
                  ? ` (${order.shippingCourier} ${order.shippingService})`
                  : ""}
              </dt>
              <dd>{formatRupiah(Number(order.shippingCost))}</dd>
            </div>
            {Number(order.discount) > 0 ? (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Diskon voucher</dt>
                <dd>-{formatRupiah(Number(order.discount))}</dd>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-border pt-2 font-semibold">
              <dt>Total</dt>
              <dd>{formatRupiah(Number(order.total))}</dd>
            </div>
          </dl>
          <Link
            href={`/orders/${order.id}/invoice`}
            className="mt-4 inline-flex h-9 items-center rounded-md border border-input px-3 text-sm hover:bg-accent"
          >
            Lihat Invoice
          </Link>
          {order.status === "WAITING_PAYMENT" ? (
            <div className="mt-4 flex flex-col gap-3">
              {order.stockReservedUntil ? (
                <PaymentDeadline
                  deadline={order.stockReservedUntil.toISOString()}
                />
              ) : null}
              <PayNowButton
                orderId={order.id}
                phone={
                  order.userId ? undefined : (order.guestPhone ?? undefined)
                }
              />
              <PaymentStatusWatcher />
            </div>
          ) : null}
        </section>
      </div>

      <Link
        href={user ? "/orders" : "/track-order"}
        className="text-sm text-muted-foreground hover:underline"
      >
        {user ? "Kembali ke daftar pesanan" : "Lacak pesanan lain"}
      </Link>
    </PageContainer>
  );
}
