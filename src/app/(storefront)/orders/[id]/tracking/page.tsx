import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { cn } from "@/lib/utils/cn";
import { PageContainer } from "@/components/layout/PageContainer";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { getShopperUser } from "@/lib/auth/session";
import { getTrackingOrderForUser } from "@/lib/orders";
import type { getTrackingOrderForUser as loadTrackingOrder } from "@/lib/orders";
import { formatDateTime } from "@/lib/utils/format";

export const metadata = { title: "Lacak Pesanan" };

// ORDER-08: detail tracking per pesanan, session-scoped (pola `/orders/[id]`).
// Query mengembalikan null untuk pesanan milik orang lain atau ID bukan UUID,
// sehingga keduanya jadi 404 generik — keberadaan pesanan tidak bocor
// (AC-ORDER-02-04). Guest tetap memakai form `/track-order` (ORDER-04).
export const instant = false;

type TrackingOrder = NonNullable<
  Awaited<ReturnType<typeof loadTrackingOrder>>
>;

type AddressJson = {
  street?: string;
  city?: string;
  province?: string;
  district?: string;
  subdistrict?: string;
  postalCode?: string;
};

// Riwayat hanya menampilkan milestone dengan waktu nyata (tanpa status dummy
// "menunggu"): cukup 1 query, tidak ada tabel riwayat status di schema.
function getMilestones(order: TrackingOrder) {
  const milestones: { label: string; at: Date }[] = [
    { label: "Pesanan dibuat", at: order.createdAt },
  ];

  if (order.payment?.paidAt) {
    milestones.push({ label: "Pembayaran diterima", at: order.payment.paidAt });
  }
  if (order.shippedAt) {
    milestones.push({ label: "Dikirim", at: order.shippedAt });
  }
  if (order.completedAt) {
    milestones.push({ label: "Selesai", at: order.completedAt });
  }

  return milestones;
}

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();

  const { id } = await params;
  const user = await getShopperUser();
  const order = user ? await getTrackingOrderForUser(user.id, id) : null;
  if (!order) notFound();

  const address = (order.shippingAddress ?? {}) as AddressJson;
  const milestones = getMilestones(order);
  const destination = [
    address.street,
    address.subdistrict,
    address.district,
    address.city,
    address.province,
    address.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <PageContainer>
      <Link
        href={`/orders/${order.id}`}
        className="text-sm text-muted-foreground hover:underline"
      >
        Kembali ke pesanan
      </Link>

      <article className="flex flex-col gap-6 rounded-xl border border-border bg-background p-4">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="text-lg font-bold tracking-tight">Lacak Pesanan</p>
            <p className="text-sm text-muted-foreground">
              {order.orderNumber} — {formatDateTime(order.createdAt)}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </header>

        <section className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <h2 className="mb-3 font-semibold">Riwayat Perjalanan</h2>
            <ol className="flex flex-col gap-3">
              {milestones.map((milestone, index) => (
                <li key={milestone.label} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      index === milestones.length - 1
                        ? "bg-primary"
                        : "bg-muted-foreground/40",
                    )}
                    aria-hidden
                  />
                  <span className="flex-1">{milestone.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDateTime(milestone.at)}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="mb-3 font-semibold">Pengiriman</h2>
            <dl className="flex flex-col gap-2">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Kurir</dt>
                <dd>
                  {[order.shippingCourier, order.shippingService]
                    .filter(Boolean)
                    .join(" - ") || "-"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Nomor resi</dt>
                <dd>{order.trackingNumber || "-"}</dd>
              </div>
              {order.shippingEtd ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Estimasi</dt>
                  <dd>{order.shippingEtd}</dd>
                </div>
              ) : null}
              {destination ? (
                <div className="flex justify-between gap-4">
                  <dt className="shrink-0 text-muted-foreground">Tujuan</dt>
                  <dd className="text-right">{destination}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        </section>
      </article>
    </PageContainer>
  );
}
