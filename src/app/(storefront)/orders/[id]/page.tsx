import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { requireCustomerPage } from "@/lib/auth/session";
import { getOrderDetail } from "@/lib/orders";
import { formatDateTime, formatRupiah } from "@/lib/utils/format";

export const metadata = { title: "Detail Pesanan" };

export const instant = false;

type AddressJson = {
  name?: string;
  phone?: string;
  street?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  note?: string;
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();

  const user = await requireCustomerPage();
  const { id } = await params;

  // getOrderDetail mengembalikan null untuk pesanan milik orang lain atau ID
  // yang bukan UUID, sehingga keduanya jadi 404 (AC-ORDER-02-04).
  const order = await getOrderDetail(user.id, id);
  if (!order) notFound();

  const address = (order.shippingAddress ?? {}) as AddressJson;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
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
            {[address.city, address.province, address.postalCode]
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
            <div className="flex justify-between border-t border-border pt-2 font-semibold">
              <dt>Total</dt>
              <dd>{formatRupiah(Number(order.total))}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">
            Pembayaran menyusul di PH-04. Reservasi stok berlaku 10 menit.
          </p>
        </section>
      </div>

      <Link href="/orders" className="text-sm text-muted-foreground hover:underline">
        Kembali ke daftar pesanan
      </Link>
    </div>
  );
}
