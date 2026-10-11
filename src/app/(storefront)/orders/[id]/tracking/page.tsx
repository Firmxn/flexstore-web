import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { requireCustomerPage } from "@/lib/auth/session";
import { getTrackingOrderForUser } from "@/lib/orders";
import { formatDateTime } from "@/lib/utils/format";

export const metadata = { title: "Status Pengiriman" };

// ORDER-08 (PH-06): tracking pesanan customer tanpa input data. Hanya pesanan
// milik pengguna yang sedang masuk yang bisa dibuka (session-scoped).
export const instant = false;

const TIMELINE = [
  { status: "PROCESSING", label: "Pesanan diproses" },
  { status: "SHIPPED", label: "Pesanan dikirim" },
  { status: "COMPLETED", label: "Pesanan selesai" },
] as const;

const STATUS_ORDER = ["WAITING_PAYMENT", "PROCESSING", "SHIPPED", "COMPLETED"];

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireCustomerPage();
  const { id } = await params;

  const order = await getTrackingOrderForUser(user.id, id);
  if (!order) notFound();

  const currentIndex = STATUS_ORDER.indexOf(order.status);

  return (
    <PageContainer>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Status Pengiriman</h1>
          <p className="text-sm text-muted-foreground">{order.orderNumber}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <section className="rounded-xl border border-border bg-background p-4 text-sm">
        <h2 className="mb-3 font-semibold">Pengiriman</h2>
        {order.fulfillment === "PICKUP" ? (
          <p className="text-muted-foreground">
            Pesanan diambil langsung di toko (tanpa pengiriman).
          </p>
        ) : (
          <>
            <p className="text-muted-foreground">
              {[order.shippingCourier, order.shippingService]
                .filter(Boolean)
                .join(" ") || "-"}
            </p>
            <p className="font-medium">
              Nomor resi: {order.trackingNumber ?? "Belum tersedia"}
            </p>
            {order.shippingEtd ? (
              <p className="text-xs text-muted-foreground">
                Estimasi: {order.shippingEtd}
              </p>
            ) : null}
          </>
        )}
      </section>

      <section className="rounded-xl border border-border bg-background p-4">
        <h2 className="mb-4 font-semibold">Riwayat</h2>
        <ol className="flex flex-col gap-4">
          {TIMELINE.map((step) => {
            const stepIndex = STATUS_ORDER.indexOf(step.status);
            const reached =
              order.status !== "CANCELED" && currentIndex >= stepIndex;
            const timestamp =
              step.status === "SHIPPED"
                ? order.shippedAt
                : step.status === "COMPLETED"
                  ? order.completedAt
                  : order.createdAt;

            return (
              <li key={step.status} className="flex items-start gap-3">
                <span
                  className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
                    reached ? "bg-success" : "bg-muted"
                  }`}
                />
                <div className="flex flex-col">
                  <span
                    className={`text-sm font-medium ${
                      reached ? "" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                  {reached ? (
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(timestamp ?? order.createdAt)}
                    </span>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <Link
        href={`/orders/${order.id}`}
        className="text-sm text-muted-foreground hover:underline"
      >
        Kembali ke detail pesanan
      </Link>
    </PageContainer>
  );
}
