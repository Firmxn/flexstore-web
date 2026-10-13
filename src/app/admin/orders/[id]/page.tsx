import { BackLink } from "@/components/layout/BackLink";
import { notFound } from "next/navigation";
import { z } from "zod";
import { AdminOrderActions } from "@/components/admin/AdminOrderActions";
import { PageHeader } from "@/components/admin/PageHeader";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { Badge } from "@/components/ui/badge";
import { listCancellationReasons } from "@/lib/config";
import { getAdminOrderDetail } from "@/lib/orders";
import { formatDateTime, formatRupiah } from "@/lib/utils/format";

const idSchema = z.string().uuid();

// ORDER-07 (PH-06): detail pesanan + panel aksi admin.
export const instant = false;

const PAYMENT_LABELS: Record<string, string> = {
  PENDING: "Menunggu Pembayaran",
  PAID: "Lunas",
  EXPIRED: "Kedaluwarsa",
  FAILED: "Gagal",
};

const REFUND_LABELS: Record<string, string> = {
  PENDING: "Menunggu Bukti",
  COMPLETED: "Selesai",
  FAILED: "Gagal",
};

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

export default async function AdminOrderDetailPage({
  params,
}: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  if (!idSchema.safeParse(id).success) notFound();

  const [order, reasons] = await Promise.all([
    getAdminOrderDetail(id),
    listCancellationReasons({ activeOnly: true }),
  ]);
  if (!order) notFound();

  const address = (order.shippingAddress ?? {}) as AddressJson;
  const isPickup = order.fulfillment === "PICKUP";

  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/admin/orders">Kembali ke daftar pesanan</BackLink>

      <PageHeader
        title={order.orderNumber}
        description={formatDateTime(order.createdAt)}
        action={<OrderStatusBadge status={order.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-6">
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

          <section className="rounded-xl border border-border bg-background p-4 text-sm">
            <h2 className="mb-3 font-semibold">
              {isPickup ? "Ambil di Toko" : "Alamat Pengiriman"}
            </h2>
            <p className="font-medium">{address.name}</p>
            <p className="text-muted-foreground">{address.phone}</p>
            {isPickup ? null : (
              <>
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
              </>
            )}
            {address.note ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Catatan: {address.note}
              </p>
            ) : null}
          </section>

          {order.trackingNumber ? (
            <section className="rounded-xl border border-border bg-background p-4 text-sm">
              <h2 className="mb-3 font-semibold">Pengiriman</h2>
              <p className="text-muted-foreground">
                {[order.shippingCourier, order.shippingService]
                  .filter(Boolean)
                  .join(" ")}
              </p>
              <p className="font-medium">Resi: {order.trackingNumber}</p>
              {order.shippedAt ? (
                <p className="text-xs text-muted-foreground">
                  Dikirim {formatDateTime(order.shippedAt)}
                </p>
              ) : null}
            </section>
          ) : null}

          {order.cancelReason || order.cancelRejectionReason ? (
            <section className="rounded-xl border border-border bg-background p-4 text-sm">
              <h2 className="mb-3 font-semibold">Pembatalan</h2>
              {order.cancelReason ? (
                <p className="text-muted-foreground">
                  Alasan pembeli: {order.cancelReason}
                </p>
              ) : null}
              {order.cancelRejectionReason ? (
                <p className="mt-1 text-muted-foreground">
                  Alasan penolakan: {order.cancelRejectionReason}
                </p>
              ) : null}
            </section>
          ) : null}
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-xl border border-border bg-background p-4 text-sm">
            <h2 className="mb-3 font-semibold">Pembeli</h2>
            <p className="font-medium">
              {order.user?.name ?? "Guest"}
            </p>
            <p className="text-muted-foreground">
              {order.user?.email ?? order.guestEmail ?? "-"}
            </p>
            <p className="text-muted-foreground">
              {order.user?.phone ?? order.guestPhone ?? "-"}
            </p>
          </section>

          <section className="rounded-xl border border-border bg-background p-4 text-sm">
            <h2 className="mb-3 font-semibold">Pembayaran</h2>
            <dl className="flex flex-col gap-2">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatRupiah(Number(order.subtotal))}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Ongkos kirim</dt>
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
            <p className="mt-3 text-xs text-muted-foreground">
              Status pembayaran:{" "}
              {order.payment
                ? (PAYMENT_LABELS[order.payment.status] ?? order.payment.status)
                : "-"}
            </p>
          </section>

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
                      {REFUND_LABELS[refund.status] ?? refund.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="rounded-xl border border-border bg-background p-4">
            <h2 className="mb-3 font-semibold">Aksi</h2>
            <AdminOrderActions
              orderId={order.id}
              status={order.status}
              cancellationReasons={reasons.map((reason) => ({
                id: reason.id,
                text: reason.text,
              }))}
              refunds={order.refunds.map((refund) => ({
                id: refund.id,
                status: refund.status,
                amount: Number(refund.amount),
              }))}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
