"use client";

// Pesanan Terbaru — daftar ringkas pesanan terbaru (ADMIN-DASH-01 poin 5).
//
// Data nyata dari `getDashboardRecentOrders()` (lib/admin/dashboard-queries):
// baris membawa UUID asli sehingga "Lihat detail" langsung membuka rute
// `/admin/orders/[id]`. Interaksi pencarian, filter, pengurutan, dan paginasi
// tetap berjalan lokal di browser.
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Ellipsis,
  Eye,
  Filter as FilterIcon,
  Search,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TABLE_HEAD_PLAIN,
} from "@/components/ui/table";
import { cn } from "@/lib/utils/cn";
import { formatRupiah } from "@/lib/utils/format";
import { ORDER_STATUS_LABELS } from "@/lib/orders/status";
import type { OrderStatus } from "@prisma/client";
import type { RecentOrderRow } from "@/lib/admin/dashboard-queries";

// Badge status bergaya "soft" (latar tint halus + dot sewarna), selaras mockup
// ADMIN-DASH-01. Semua warna memakai token brand — tanpa warna hardcode.
type SoftVariant =
  | "softPrimary"
  | "softNeutral"
  | "softSuccess"
  | "softDestructive";

const STATUS_BADGE: Record<OrderStatus, SoftVariant> = {
  WAITING_PAYMENT: "softNeutral",
  PROCESSING: "softPrimary",
  SHIPPED: "softPrimary",
  COMPLETED: "softSuccess",
  CANCEL_REQUESTED: "softDestructive",
  CANCELED: "softNeutral",
};

// Sentinel "semua" untuk filter (dipakai tab status dan menu status pembayaran).
const ALL = "ALL" as const;

// Tab filter status pesanan — selaras mockup ADMIN-DASH-01:
// "Semua / Diproses / Menunggu / Dibatalkan". Satu tab bisa mencakup lebih dari
// satu status (mis. "Dibatalkan" = permintaan batal maupun sudah dibatalkan).
type TabKey = "ALL" | "PROCESSING" | "WAITING_PAYMENT" | "CANCELED";

const ORDER_TABS: { key: TabKey; label: string; statuses: OrderStatus[] }[] = [
  { key: "ALL", label: "Semua", statuses: [] },
  { key: "PROCESSING", label: "Diproses", statuses: ["PROCESSING"] },
  { key: "WAITING_PAYMENT", label: "Menunggu", statuses: ["WAITING_PAYMENT"] },
  {
    key: "CANCELED",
    label: "Dibatalkan",
    statuses: ["CANCEL_REQUESTED", "CANCELED"],
  },
];

// Baris per halaman paginasi (mockup Figma menampilkan 5 baris).
const PAGE_SIZE = 5;

type SortKey = "code" | "date" | "total";
type SortDir = "asc" | "desc";

// Kunci sortir. `code` dan `total` punya tipe bawaan; `date` masih string display
// ("31 Okt 2026, 09:12"), jadi diurutkan turun-menurun sesuai urutan array mock
// (yang memang sudah terurut waktu menurun) — cukup untuk prototipe.
function compare(a: RecentOrderRow, b: RecentOrderRow, key: SortKey): number {
  if (key === "total") return a.total - b.total;
  if (key === "code") return a.code.localeCompare(b.code, "id");
  return 0;
}

// Kepala kolom yang bisa diurutkan. Dideklarasikan di scope module (bukan di dalam
// render) supaya identitas komponennya stabil antar-render — kalau didefinisikan di
// dalam render, React Compiler mereset state komponen tiap render.
function SortButton({
  label,
  k,
  align,
  sort,
  onSort,
}: {
  label: string;
  k: SortKey;
  align?: "right";
  sort: { key: SortKey; dir: SortDir };
  onSort: (key: SortKey) => void;
}) {
  const active = sort.key === k;
  const Icon = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <button
      type="button"
      onClick={() => onSort(k)}
      className={cn(
        "inline-flex items-center gap-1 rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        align === "right" && "flex-row-reverse",
        active ? "text-foreground" : "text-muted-foreground",
      )}
      aria-label={`Urutkan menurut ${label}`}
    >
      {label}
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  );
}

export function RecentOrdersTable({
  orders,
  title,
  description,
  viewAllHref,
  viewAllLabel = "Lihat semua pesanan",
}: {
  orders: RecentOrderRow[];
  title: string;
  description?: string;
  viewAllHref: string;
  viewAllLabel?: string;
}) {
  const [statusFilter, setStatusFilter] = useState<TabKey>("ALL");
  const [query, setQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<string>(ALL);
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: "date",
    dir: "desc",
  });
  const [page, setPage] = useState(1);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Daftar status pembayaran unik untuk menu Filter (dari data).
  const paymentMethods = useMemo(
    () => Array.from(new Set(orders.map((o) => o.paymentMethod))).sort(),
    [orders],
  );

  // Hitung per tab SEBELUM difilter status, supaya angka tab = jumlah total
  // per status pada cakupan pencarian/filter pembayaran saat ini.
  const statusCounts = useMemo(() => {
    const base = orders.filter(
      (o) =>
        (query.trim() === "" ||
          o.code.toLowerCase().includes(query.trim().toLowerCase()) ||
          o.buyer.toLowerCase().includes(query.trim().toLowerCase())) &&
        (paymentFilter === ALL || o.paymentMethod === paymentFilter),
    );
    const counts: Record<TabKey, number> = {
      ALL: base.length,
      PROCESSING: 0,
      WAITING_PAYMENT: 0,
      CANCELED: 0,
    };
    for (const o of base) {
      for (const tab of ORDER_TABS) {
        if (tab.statuses.includes(o.status)) counts[tab.key] += 1;
      }
    }
    return counts;
  }, [orders, query, paymentFilter]);

  const activeTab = ORDER_TABS.find((t) => t.key === statusFilter) ?? ORDER_TABS[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = orders.filter(
      (o) =>
        (activeTab.statuses.length === 0 || activeTab.statuses.includes(o.status)) &&
        (paymentFilter === ALL || o.paymentMethod === paymentFilter) &&
        (q === "" || o.code.toLowerCase().includes(q) || o.buyer.toLowerCase().includes(q)),
    );
    const sorted = [...rows];
    if (sort.key !== "date") {
      sorted.sort((a, b) => compare(a, b, sort.key));
      if (sort.dir === "desc") sorted.reverse();
    } else if (sort.dir === "asc") {
      // "date" asc = kebalikan urutan array mock (yang menurun menurut waktu).
      sorted.reverse();
    }
    return sorted;
  }, [orders, activeTab, paymentFilter, query, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const rangeStart = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, filtered.length);

  function setSortKey(key: SortKey) {
    setPage(1);
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "desc" },
    );
  }

  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode((c) => (c === code ? null : c)), 1500);
    } catch {
      // Clipboard bisa ditolak oleh browser; abaikan, prototipe tanpa pesan.
    }
  }

  const hasActiveFilter = paymentFilter !== ALL;

  return (
    <Card>
      <CardHeader className="p-6">
        <div className="flex justify-between items-start w-full">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="text-base">{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
        <Link
          href={viewAllHref}
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          {viewAllLabel}
        </Link>
      </div>
      </CardHeader>

      {/* Toolbar: tab status (kiri) + pencarian/filter (kanan), sebaris. */}
      <div className="flex flex-wrap items-center gap-3 px-6 pb-4">
        <Tabs
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value as TabKey);
            setPage(1);
          }}
        >
          <TabsList className="h-auto gap-1 rounded-none bg-transparent p-0">
            {ORDER_TABS.map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-normal text-muted-foreground hover:text-foreground data-[state=active]:bg-muted data-[state=active]:font-medium data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                {tab.label}
                <span className="text-xs tabular-nums text-muted-foreground">
                  {statusCounts[tab.key]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-60">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Cari nomor pesanan"
              aria-label="Cari nomor pesanan"
              className="h-9 pl-8"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={hasActiveFilter ? "default" : "outline"}
                size="sm"
                className="h-9"
              >
                <FilterIcon className="h-4 w-4" aria-hidden="true" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Status pembayaran</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => { setPaymentFilter(ALL); setPage(1); }}>
                Semua status
                {paymentFilter === ALL ? (
                  <span className="ml-auto text-primary" aria-hidden="true">✓</span>
                ) : null}
              </DropdownMenuItem>
              {paymentMethods.map((m) => (
                <DropdownMenuItem
                  key={m}
                  onSelect={() => { setPaymentFilter(m); setPage(1); }}
                >
                  {m}
                  {paymentFilter === m ? (
                    <span className="ml-auto text-primary" aria-hidden="true">✓</span>
                  ) : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardContent className="p-0">
        <Table wrapperClassName="rounded-none border-0">
          <TableHeader className={TABLE_HEAD_PLAIN}>
            <TableRow className="border-t border-border hover:bg-transparent">
              <TableHead className="pl-4">No.</TableHead>
              <TableHead>
                <SortButton label="Pesanan" k="code" sort={sort} onSort={setSortKey} />
              </TableHead>
              <TableHead>Pembeli</TableHead>
              <TableHead className="text-right">
                <SortButton label="Total" k="total" align="right" sort={sort} onSort={setSortKey} />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">
                <SortButton label="Waktu" k="date" align="right" sort={sort} onSort={setSortKey} />
              </TableHead>
              <TableHead className="w-10 pr-4">
                <span className="sr-only">Aksi</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  Tidak ada pesanan pada filter ini.
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((order, idx) => (
                <TableRow key={order.code}>
                  <TableCell className="pl-4 tabular-nums">
                    {(safePage - 1) * PAGE_SIZE + idx + 1}
                  </TableCell>
                  <TableCell>
                    <span className="block font-medium tabular-nums">
                      {order.code}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {order.itemCount} item · {order.paymentMethod}
                    </span>
                  </TableCell>
                  <TableCell>{order.buyer}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {formatRupiah(order.total)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={STATUS_BADGE[order.status]}
                      className="gap-1.5 font-medium"
                    >
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-current"
                        aria-hidden="true"
                      />
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {order.date}
                  </TableCell>
                  <TableCell className="pr-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label={`Aksi untuk pesanan ${order.code}`}
                        >
                          <Ellipsis className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          {/* Detail pesanan asli (UUID dari data dashboard). */}
                          <Link href={order.href}>
                            <Eye aria-hidden="true" />
                            Lihat detail
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => copyCode(order.code)}>
                          <Copy aria-hidden="true" />
                          {copiedCode === order.code ? "Tersalin" : "Salin nomor"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Footer: rentang data + navigasi halaman (selaras mockup Figma). */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
          <span className="text-xs text-muted-foreground">
            Menampilkan {rangeStart}–{rangeEnd} dari {filtered.length} pesanan
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              disabled={safePage >= pageCount}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            >
              Berikutnya
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
