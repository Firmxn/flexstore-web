import { PageHeader } from "@/components/admin/PageHeader";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getReportBundle } from "@/lib/reports";
import { formatRupiah } from "@/lib/utils/format";

// REPORT-01 (PH-06): lima laporan PRD 4.11.
export const instant = false;

const DATE_FORMAT = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" });

const REFUND_LABELS: Record<string, string> = {
  PENDING: "Menunggu Bukti",
  COMPLETED: "Selesai",
  FAILED: "Gagal",
};

function parseDate(
  value: string | string[] | undefined,
  endOfDay: boolean,
): Date | undefined {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  const suffix = endOfDay ? "T23:59:59.999Z" : "T00:00:00.000Z";
  const date = new Date(`${value}${suffix}`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function toInputValue(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export default async function AdminReportsPage({
  searchParams,
}: PageProps<"/admin/reports">) {
  const params = await searchParams;
  const from = parseDate(params.from, false);
  const to = parseDate(params.to, true);

  const report = await getReportBundle({ from, to });
  const lowStock = report.stock.filter((item) => item.lowStock);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Laporan"
        description="Penjualan, kinerja produk, stok, pesanan, dan refund."
      />

      <form
        action="/admin/reports"
        className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-end"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="report-from" className="text-sm font-medium">
            Dari tanggal
          </label>
          <Input
            id="report-from"
            name="from"
            type="date"
            defaultValue={toInputValue(report.range.from)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="report-to" className="text-sm font-medium">
            Sampai tanggal
          </label>
          <Input
            id="report-to"
            name="to"
            type="date"
            defaultValue={toInputValue(report.range.to)}
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-10 shrink-0 items-center rounded-md border border-input px-4 text-sm hover:bg-accent"
        >
          Terapkan
        </button>
      </form>

      <section className="rounded-xl border border-border bg-background p-4">
        <h2 className="mb-3 font-semibold">1. Laporan Penjualan</h2>
        <p className="mb-3 text-sm text-muted-foreground">
          {DATE_FORMAT.format(report.range.from)} -{" "}
          {DATE_FORMAT.format(report.range.to)}
        </p>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <SummaryCard label="Transaksi" value={String(report.sales.count)} />
          <SummaryCard label="Subtotal" value={formatRupiah(report.sales.subtotal)} />
          <SummaryCard label="Ongkir" value={formatRupiah(report.sales.shipping)} />
          <SummaryCard label="Diskon" value={formatRupiah(report.sales.discount)} />
          <SummaryCard label="Total" value={formatRupiah(report.sales.total)} />
        </dl>
      </section>

      <section className="rounded-xl border border-border bg-background p-4">
        <h2 className="mb-3 font-semibold">2. Kinerja Produk</h2>
        {report.products.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada produk terjual pada rentang ini.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produk</TableHead>
                <TableHead>Varian</TableHead>
                <TableHead className="text-right">Terjual</TableHead>
                <TableHead className="text-right">Pendapatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.products.slice(0, 50).map((item) => (
                <TableRow key={`${item.productName}-${item.variantName}`}>
                  <TableCell className="text-sm">{item.productName}</TableCell>
                  <TableCell className="text-sm">{item.variantName}</TableCell>
                  <TableCell className="text-right text-sm">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {formatRupiah(item.revenue)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>

      <section className="rounded-xl border border-border bg-background p-4">
        <div className="mb-3 flex items-center gap-2">
          <h2 className="font-semibold">3. Laporan Stok</h2>
          {lowStock.length > 0 ? (
            <Badge variant="destructive">{lowStock.length} menipis</Badge>
          ) : null}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produk</TableHead>
              <TableHead className="text-right">Varian</TableHead>
              <TableHead className="text-right">Total Stok</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.stock.slice(0, 50).map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-sm">{item.name}</TableCell>
                <TableCell className="text-right text-sm">
                  {item.variantCount}
                </TableCell>
                <TableCell className="text-right text-sm">
                  {item.totalStock}
                </TableCell>
                <TableCell>
                  {item.lowStock ? (
                    <Badge variant="destructive">Stok menipis</Badge>
                  ) : (
                    <Badge variant="success">Aman</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className="rounded-xl border border-border bg-background p-4">
        <h2 className="mb-3 font-semibold">4. Laporan Pesanan</h2>
        {report.orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada pesanan pada rentang ini.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.orders.map((row) => (
                <TableRow key={row.status}>
                  <TableCell>
                    <OrderStatusBadge status={row.status} />
                  </TableCell>
                  <TableCell className="text-right text-sm">{row.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>

      <section className="rounded-xl border border-border bg-background p-4">
        <h2 className="mb-3 font-semibold">5. Laporan Refund</h2>
        {report.refunds.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada refund pada rentang ini.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="text-right">Nilai</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.refunds.map((row) => (
                <TableRow key={row.status}>
                  <TableCell className="text-sm">
                    {REFUND_LABELS[row.status] ?? row.status}
                  </TableCell>
                  <TableCell className="text-right text-sm">{row.count}</TableCell>
                  <TableCell className="text-right text-sm">
                    {formatRupiah(row.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-semibold">{value}</dd>
    </div>
  );
}
