import Link from "next/link";
import { connection } from "next/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";
import { countOrdersByStatus } from "@/lib/orders";
import { ORDER_STATUS_LABELS } from "@/lib/orders/status";
import {
  getSalesReport,
  getStockReport,
  LOW_STOCK_THRESHOLD,
  resolveReportRange,
} from "@/lib/reports";
import { formatRupiah } from "@/lib/utils/format";

// Dasbor admin (PH-06): ringkasan operasional + pintasan.
export const instant = false;

const STATUS_ORDER = [
  "WAITING_PAYMENT",
  "PROCESSING",
  "SHIPPED",
  "COMPLETED",
  "CANCEL_REQUESTED",
  "CANCELED",
] as const;

export default async function AdminIndexPage() {
  // Rentang laporan memakai waktu sekarang, jadi dasbor harus dirender saat
  // request (bukan prerender).
  await connection();

  const [statusCounts, sales, stock] = await Promise.all([
    countOrdersByStatus(),
    getSalesReport(resolveReportRange({})),
    getStockReport(),
  ]);

  const lowStock = stock.filter((item) => item.lowStock);
  const pendingCancellations = statusCounts.CANCEL_REQUESTED ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dasbor"
        description="Ringkasan 30 hari terakhir dan hal yang butuh perhatian."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground">Penjualan 30 hari</p>
          <p className="text-lg font-bold">{formatRupiah(sales.total)}</p>
          <p className="text-xs text-muted-foreground">{sales.count} transaksi</p>
        </div>
        <Link
          href="/admin/orders?status=CANCEL_REQUESTED"
          className="rounded-xl border border-border bg-background p-4 hover:bg-accent"
        >
          <p className="text-xs text-muted-foreground">Pengajuan pembatalan</p>
          <p className="text-lg font-bold">{pendingCancellations}</p>
          <p className="text-xs text-muted-foreground">Perlu ditinjau</p>
        </Link>
        <Link
          href="/admin/reports"
          className="rounded-xl border border-border bg-background p-4 hover:bg-accent"
        >
          <p className="text-xs text-muted-foreground">
            Stok menipis ({"<="} {LOW_STOCK_THRESHOLD})
          </p>
          <p className="text-lg font-bold">{lowStock.length}</p>
          <p className="text-xs text-muted-foreground">Lihat laporan stok</p>
        </Link>
        <Link
          href="/admin/orders?status=PROCESSING"
          className="rounded-xl border border-border bg-background p-4 hover:bg-accent"
        >
          <p className="text-xs text-muted-foreground">Perlu dikirim</p>
          <p className="text-lg font-bold">{statusCounts.PROCESSING ?? 0}</p>
          <p className="text-xs text-muted-foreground">Status Diproses</p>
        </Link>
      </div>

      <section className="rounded-xl border border-border bg-background p-4">
        <h2 className="mb-3 font-semibold">Pesanan per Status</h2>
        <ul className="flex flex-wrap gap-3">
          {STATUS_ORDER.map((status) => (
            <li key={status}>
              <Link
                href={`/admin/orders?status=${status}`}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent"
              >
                <span>{ORDER_STATUS_LABELS[status]}</span>
                <Badge variant="secondary">{statusCounts[status] ?? 0}</Badge>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
