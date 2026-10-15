import { Suspense } from "react";
import Link from "next/link";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { PageHeader } from "@/components/admin/PageHeader";
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
import { getVouchers } from "@/lib/vouchers";
import { VOUCHER_TYPE_LABELS } from "@/lib/vouchers/validation";
import { formatRupiah } from "@/lib/utils/format";

const PAGE_SIZE = 20;

// `searchParams` dan data voucher dibaca di level halaman, di luar Suspense.
// `instant = false` menandai rute ini sebagai blocking route (Next.js 16
// cacheComponents); konfigurasi di layout tidak diwariskan ke halaman.
export const instant = false;

function parsePage(value: string | string[] | undefined): number {
  if (typeof value !== "string") return 1;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function formatValue(voucher: {
  type: string;
  discountPercentage: unknown;
  discountAmount: unknown;
  maxDiscount: unknown;
}): string {
  if (voucher.type === "PERCENTAGE") {
    const base = `${Number(voucher.discountPercentage ?? 0)}%`;
    return voucher.maxDiscount != null
      ? `${base} (maks ${formatRupiah(Number(voucher.maxDiscount))})`
      : base;
  }
  const amount = formatRupiah(Number(voucher.discountAmount ?? 0));
  return voucher.type === "SHIPPING" ? `Ongkir ${amount}` : amount;
}

function formatPeriod(from: Date, until: Date): string {
  const format = (value: Date) =>
    new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(value);
  return `${format(from)} - ${format(until)}`;
}

async function VoucherTable({
  params,
}: {
  params: Record<string, string | string[] | undefined>;
}) {
  const page = parsePage(params.page);
  const search =
    typeof params.search === "string" ? params.search.slice(0, 200) : undefined;

  const { vouchers, total } = await getVouchers({
    page,
    limit: PAGE_SIZE,
    search,
  });

  if (vouchers.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-background p-12 text-center text-sm text-muted-foreground">
        Belum ada voucher yang cocok.
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const now = new Date();

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kode</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Nilai</TableHead>
            <TableHead>Periode</TableHead>
            <TableHead>Pemakaian</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vouchers.map((voucher) => {
            const active =
              voucher.isActive &&
              voucher.validFrom <= now &&
              voucher.validUntil >= now;

            return (
              <TableRow key={voucher.id}>
                <TableCell className="font-medium">{voucher.code}</TableCell>
                <TableCell className="text-sm">
                  {VOUCHER_TYPE_LABELS[voucher.type]}
                </TableCell>
                <TableCell className="text-sm">{formatValue(voucher)}</TableCell>
                <TableCell className="text-sm">
                  {formatPeriod(voucher.validFrom, voucher.validUntil)}
                </TableCell>
                <TableCell className="text-sm">
                  {voucher.usageCount}
                  {voucher.usageLimit != null ? ` / ${voucher.usageLimit}` : ""}
                </TableCell>
                <TableCell>
                  <Badge variant={active ? "success" : "secondary"}>
                    {active ? "Aktif" : "Tidak Aktif"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/vouchers/${voucher.id}/edit`}
                      className="inline-flex h-9 items-center rounded-md border border-input px-3 text-sm hover:bg-accent"
                    >
                      Ubah
                    </Link>
                    <DeleteButton
                      url={`/api/admin/vouchers/${voucher.id}`}
                      confirmTitle={`Hapus voucher "${voucher.code}"?`}
                      confirmDescription="Voucher akan dihapus permanen dan tidak bisa dipakai lagi."
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {total} voucher - halaman {page} dari {totalPages}
        </span>
        <div className="flex gap-2">
          {page > 1 ? (
            <Link
              href={`/admin/vouchers?page=${page - 1}`}
              className="inline-flex h-9 items-center rounded-md border border-input px-3 hover:bg-accent"
            >
              Sebelumnya
            </Link>
          ) : null}
          {page < totalPages ? (
            <Link
              href={`/admin/vouchers?page=${page + 1}`}
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

export default async function AdminVouchersPage({
  searchParams,
}: PageProps<"/admin/vouchers">) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Voucher"
        description="Kelola kode voucher dan aturan pemakaiannya."
        action={
          <Link
            href="/admin/vouchers/new"
            className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Tambah Voucher
          </Link>
        }
      />

      <form
        action="/admin/vouchers"
        className="flex flex-col gap-2 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-center"
      >
        <Input
          name="search"
          placeholder="Cari kode voucher..."
          defaultValue={search}
          maxLength={200}
          className="sm:max-w-64"
        />
        <button
          type="submit"
          className="inline-flex h-10 shrink-0 items-center rounded-md border border-input px-4 text-sm hover:bg-accent"
        >
          Terapkan
        </button>
      </form>

      <Suspense
        fallback={<p className="text-sm text-muted-foreground">Memuat voucher...</p>}
      >
        <VoucherTable params={params} />
      </Suspense>
    </div>
  );
}
