import Link from "next/link";
import { BackLink } from "@/components/layout/BackLink";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { PageContainer } from "@/components/layout/PageContainer";
import { CancelOrderForm } from "@/components/orders/CancelOrderForm";
import { GuestOrderNotice } from "@/components/orders/GuestOrderNotice";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { PaymentDeadline } from "@/components/orders/PaymentDeadline";
import { ReorderButton } from "@/components/orders/ReorderButton";
import { PaymentStatusWatcher } from "@/components/payments/PaymentStatusWatcher";
import { PayNowButton } from "@/components/payments/PayNowButton";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
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
      {/* Mode customer: kembali ke daftar pesanan; mode guest: kembali ke
          halaman pelacakan tempat mereka datang. */}
      <BackLink href={user ? "/orders" : "/track-order"}>
        {user ? "Kembali ke daftar pesanan" : "Lacak pesanan lain"}
      </BackLink>

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
              className="flex flex-wrap items-center justify-between gap-2 py-2 first:pt-0"
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

        {/* "Pesan Lagi" tinggal di dalam container Item penempatan tombol
            invoice di container pembayaran — kanan, setelah konten. */}
        {user ? (
          <div className="mt-4 flex justify-end">
            <ReorderButton orderId={order.id} />
          </div>
        ) : null}
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Struktur dl gap-2 identik dengan kartu Pembayaran — ritme baris
            (label nembel di kiri, nilai di kanan) seragam antar kartu. */}
        <section className="rounded-xl border border-border bg-background p-4 text-sm">
          <h2 className="mb-3 font-semibold">
            {order.fulfillment === "PICKUP" ? "Ambil di Toko" : "Alamat Pengiriman"}
          </h2>
          <dl className="flex flex-col gap-2">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Penerima</dt>
              <dd className="text-right font-medium">{address.name}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Telepon</dt>
              <dd className="text-right">{address.phone}</dd>
            </div>
            {order.fulfillment === "PICKUP" ? null : (
              <>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Alamat</dt>
                  <dd className="text-right">
                    {address.street}
                    <br />
                    {[
                      address.subdistrict,
                      address.district,
                      address.city,
                      address.province,
                      address.postalCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Pengiriman</dt>
                  <dd className="text-right">
                    {order.shippingCourier && order.shippingService
                      ? `${order.shippingCourier} ${order.shippingService}`
                      : "-"}
                  </dd>
                </div>
                {order.trackingNumber ? (
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Nomor resi</dt>
                    <dd className="text-right">{order.trackingNumber}</dd>
                  </div>
                ) : null}
              </>
            )}
            {address.note ? (
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Catatan</dt>
                <dd className="text-right">{address.note}</dd>
              </div>
            ) : null}
          </dl>
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
          {/* Invoice hanya sah setelah pembayaran lunas (keputusan 2026-10-11,
              `docs/04` bagian 10). Sebelum bayar, rincian tagihan sudah ada di
              blok ini dan dokumen yang berlaku adalah halaman bayar Xendit. */}
          {order.payment?.status === "PAID" ? (
            <Link
              href={`/orders/${order.id}/invoice`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4")}
            >
              Lihat Invoice
            </Link>
          ) : null}
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

      {user ? (
        /* Pelacakan selalu tersedia untuk customer — riwayat milestone pesanan
            berlaku sejak dibuat (ORDER-08), bukan hanya setelah dikirim. */
        <section className="rounded-xl border border-border bg-background p-4 text-sm">
          {/* Struktur identik dengan kartu Pembatalan: heading, teks penjelas,
              lalu tombol aksi di bawah — bukan tombol di kanan heading. */}
          <h2 className="mb-3 font-semibold">Pelacakan</h2>
          <p className="mb-3 text-muted-foreground">
            {order.trackingNumber
              ? `Resi ${order.shippingCourier ?? ""} ${order.shippingService ?? ""}: ${order.trackingNumber}`
              : "Riwayat status pesanan sejak dibuat hingga selesai."}
          </p>
          <Link
            href={`/orders/${order.id}/tracking`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-700",
            )}
          >
            Lihat Pelacakan
          </Link>
        </section>
      ) : order.trackingNumber ? (
        <section className="rounded-xl border border-border bg-background p-4 text-sm">
          <h2 className="mb-3 font-semibold">Pengiriman</h2>
          <p className="text-muted-foreground">
            {[order.shippingCourier, order.shippingService]
              .filter(Boolean)
              .join(" ")}
          </p>
          <p className="font-medium">Nomor resi: {order.trackingNumber}</p>
        </section>
      ) : null}

      {order.status === "CANCEL_REQUESTED" ? (
        <section className="rounded-xl border border-border bg-background p-4 text-sm">
          <h2 className="mb-3 font-semibold">Pengajuan Pembatalan</h2>
          <p className="text-muted-foreground">
            Pengajuan pembatalan Anda sedang ditinjau Store Admin.
          </p>
          {order.cancelReason ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Alasan: {order.cancelReason}
            </p>
          ) : null}
        </section>
      ) : null}

      {order.cancelRejectionReason ? (
        <section className="rounded-xl border border-border bg-background p-4 text-sm">
          <h2 className="mb-3 font-semibold">Pembatalan Ditolak</h2>
          <p className="text-muted-foreground">{order.cancelRejectionReason}</p>
        </section>
      ) : null}

      {order.refunds.length > 0 ? (
        <section className="rounded-xl border border-border bg-background p-4 text-sm">
          <h2 className="mb-3 font-semibold">Refund</h2>
          <ul className="flex flex-col gap-2">
            {order.refunds.map((refund) => (
              <li key={refund.id} className="flex items-center justify-between">
                <span>{formatRupiah(Number(refund.amount))}</span>
                <Badge
                  variant={refund.status === "COMPLETED" ? "success" : "secondary"}
                >
                  {refund.status === "COMPLETED"
                    ? "Selesai"
                    : refund.status === "FAILED"
                      ? "Gagal"
                      : "Menunggu Bukti"}
                </Badge>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {order.status === "WAITING_PAYMENT" || order.status === "PROCESSING" ? (
        <section className="rounded-xl border border-border bg-background p-4 text-sm">
          <h2 className="mb-3 font-semibold">Pembatalan</h2>
          <p className="mb-3 text-muted-foreground">
            Pembatalan berlaku untuk seluruh pesanan dan hanya selama pesanan
            belum dikirim. Store Admin akan meninjau pengajuan Anda.
          </p>
          <CancelOrderForm orderId={order.id} />
        </section>
      ) : null}
    </PageContainer>
  );
}
