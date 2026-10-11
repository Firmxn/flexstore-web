import { Suspense } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  adminOrderListQuerySchema,
  listAdminOrders,
  ORDER_STATUS_FILTERS,
} from "@/lib/orders";
import { ORDER_STATUS_LABELS } from "@/lib/orders/status";
import { formatDateTime, formatRupiah } from "@/lib/utils/format";

// ORDER-07 (PH-06): daftar pesanan untuk Store Admin.
// `instant = false` menandai rute ini sebagai blocking route (Next.js 16
// cacheComponents); konfigurasi di layout tidak diwariskan ke halaman.
export const instant = false;

const PAGE_SIZE = 20;

const PAYMENT_LABELS: Record<string, string> = {
  PENDING: "Menunggu",
  PAID: "Lunas",
  EXPIRED: "Kedaluwarsa",
  FAILED: "Gagal",
};

function buyerLabel(order: {
  guestPhone: string | null;
  user: { name: string; email: string | null } | null;
}): string {
  if (order.user) return order.user.email ?? order.user.name;
  return order.guestPhone ?? "Guest";
}

async function OrderTable({
  params,
}: {
  params: Record<string, string | string[] | undefined>;
}) {
  const parsed = adminOrderListQuerySchema.safeParse({
    status: typeof params.status === "string" ? params.status : undefined,
    search: typeof params.search === "string" ? params.search : undefined,
    page: typeof params.page === "string" ? params.page : undefined,
    limit: PAGE_SIZE,
  });
  const query = parsed.success
    ? parsed.data
    : { page: 1, limit: PAGE_SIZE, status: undefined, search: undefined };

  const { orders, total } = await listAdminOrders(query);

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-background p-12 text-center text-sm text-muted-foreground">
        Belum ada pesanan yang cocok.
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nomor</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Pembeli</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pembayaran</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.orderNumber}</TableCell>
              <TableCell className="text-sm">
                {formatDateTime(order.createdAt)}
              </TableCell>
              <TableCell className="text-sm">{buyerLabel(order)}</TableCell>
              <TableCell className="text-sm">
                {formatRupiah(Number(order.total))}
              </TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-sm">
                {order.payment
                  ? (PAYMENT_LABELS[order.payment.status] ?? order.payment.status)
                  : "-"}
              </TableCell>
              <TableCell className="text-right">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="inline-flex h-9 items-center rounded-md border border-input px-3 text-sm hover:bg-accent"
                >
                  Detail
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {total} pesanan - halaman {query.page} dari {totalPages}
        </span>
        <div className="flex gap-2">
          {query.page > 1 ? (
            <Link
              href={`/admin/orders?page=${query.page - 1}`}
              className="inline-flex h-9 items-center rounded-md border border-input px-3 hover:bg-accent"
            >
              Sebelumnya
            </Link>
          ) : null}
          {query.page < totalPages ? (
            <Link
              href={`/admin/orders?page=${query.page + 1}`}
              className="inline-flex h-9 items-center rounded-md border border-input px-3 hover:bg-accent"
            >
              Selanjutnya
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default async function AdminOrdersPage({
  searchParams,
}: PageProps<"/admin/orders">) {
  const params = await searchParams;
  const activeStatus =
    typeof params.status === "string" ? params.status : undefined;
  const search = typeof params.search === "string" ? params.search : "";

  const buildHref = (status?: string) => {
    const query = new URLSearchParams();
    if (status) query.set("status", status);
    if (search) query.set("search", search);
    const suffix = query.toString();
    return suffix ? `/admin/orders?${suffix}` : "/admin/orders";
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Pesanan"
        description="Kelola status pesanan, pengiriman, pembatalan, dan refund."
      />

      <div className="flex flex-wrap gap-2">
        <Link
          href={buildHref()}
          className={`inline-flex h-9 items-center rounded-full border px-3 text-sm ${
            activeStatus ? "border-input hover:bg-accent" : "bg-primary text-primary-foreground"
          }`}
        >
          Semua
        </Link>
        {ORDER_STATUS_FILTERS.map((status) => (
          <Link
            key={status}
            href={buildHref(status)}
            className={`inline-flex h-9 items-center rounded-full border px-3 text-sm ${
              activeStatus === status
                ? "bg-primary text-primary-foreground"
                : "border-input hover:bg-accent"
            }`}
          >
            {ORDER_STATUS_LABELS[status]}
          </Link>
        ))}
      </div>

      <form
        action="/admin/orders"
        className="flex flex-col gap-2 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-center"
      >
        {activeStatus ? (
          <input type="hidden" name="status" value={activeStatus} />
        ) : null}
        <Input
          name="search"
          placeholder="Cari nomor pesanan, nama, email, atau nomor HP..."
          defaultValue={search}
          maxLength={100}
          className="sm:max-w-80"
        />
        <button
          type="submit"
          className="inline-flex h-10 shrink-0 items-center rounded-md border border-input px-4 text-sm hover:bg-accent"
        >
          Terapkan
        </button>
      </form>

      <Suspense
        fallback={<p className="text-sm text-muted-foreground">Memuat pesanan...</p>}
      >
        <OrderTable params={params} />
      </Suspense>
    </div>
  );
}
