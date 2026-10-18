import { prisma } from "@/lib/db/prisma";
import type { OrderStatus, ProductStatus } from "@prisma/client";
import { formatRupiah } from "@/lib/utils/format";

// ADMIN-DASH-01 (PH-12): sumber data dasbor modern Store Admin, menggantikan
// deret mock. Definisi angka mengikuti REPORT-01 supaya konsisten dengan
// /admin/reports: nilai penjualan = pesanan dibayar (Payment PAID) dan tidak
// dibatalkan (status != CANCELED), agregasi di JavaScript atas baris Prisma
// (tanpa raw SQL, skala MVP).

// ==== Jenis data panel (dipakai komponen dashboard/) ====

export type KpiTrendDirection = "up" | "down" | "flat";
// Cara nilai KPI diformat di layar: mata uang (formatRupiah) atau angka biasa.
export type KpiValueFormat = "currency" | "count";

export type KpiCardData = {
  label: string;
  value: number;
  valueFormat: KpiValueFormat;
  // Pembanding dengan periode sebelumnya (mis. "+8,1%", "-2").
  trendLabel: string;
  trendDirection: KpiTrendDirection;
  // Kalimat pendamping di bawah angka (sudah diformat penuh bila rupiah).
  footnote: string;
  // Opsional: tautan pintasan keluar dari kartu.
  href?: string;
};

export type SalesPoint = {
  label: string;
  sales: number;
  orders: number;
};

export type ActionNeededItem = {
  label: string;
  description: string;
  count: number;
  href: string;
  tone: "primary" | "destructive" | "muted";
};

export type RecentOrderRow = {
  code: string;
  buyer: string;
  itemCount: number;
  // Label status pembayaran pesanan (data nyata hanya punya status Payment,
  // bukan kanal — docs/03 ADMIN-DASH-01 keputusan implementasi).
  paymentMethod: string;
  total: number;
  status: OrderStatus;
  date: string;
  // Detail pesanan asli (UUID) — dibutuhkan AC-ADMIN-DASH-01-05.
  href: string;
};

export type TopProductRow = {
  rank: number;
  name: string;
  // Baris meta di bawah nama produk: jumlah varian yang berkontribusi.
  meta: string;
  sold: number;
  revenue: number;
  category: string;
  status: ProductStatus;
  // Rute admin produk; null bila produk sudah tidak ada (nama snapshot saja).
  href: string | null;
};

// ==== Rentang periode (zona waktu Asia/Jakarta, keputusan bagian 10) ====

export type DashboardPresetKey = "today" | "7d" | "30d" | "custom";

export type DashboardRange = {
  preset: DashboardPresetKey;
  label: string;
  // [from, to) — to eksklusif lewat `lt` supaya batas hari bersih.
  from: Date;
  to: Date;
  // Periode pembanding sama panjang di depannya (untuk kartu KPI).
  prevFrom: Date;
  prevTo: Date;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const DASH_TZ = "Asia/Jakarta";

// UTC+7 konstan (tanpa DST). Key lokal "YYYY-MM-DD" berasal dari Intl, lalu
// batas hari di-hitung lewat Date.UTC dikurangi 7 jam.
function jakartaDateKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: DASH_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function dayStartUtc(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d) - 7 * HOUR_MS);
}

function addDaysKey(key: string, days: number): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d) + days * DAY_MS)
    .toISOString()
    .slice(0, 10);
}

// Validasi key asli (mis. "2026-02-30" harus ditolak, bukan di-roll).
function isValidDateKey(key: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toISOString().slice(0, 10) === key;
}

const MONTHS_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

function shortDateLabel(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return `${d} ${MONTHS_ID[m - 1]} ${y}`;
}

export type DashboardRangeInput = {
  preset?: string;
  from?: string;
  to?: string;
};

export function resolveDashboardRange(
  input: DashboardRangeInput,
): { range: DashboardRange } | { error: string } {
  const todayKey = jakartaDateKey(new Date());

  if (input.preset === "today") {
    const from = dayStartUtc(todayKey);
    const to = dayStartUtc(addDaysKey(todayKey, 1));
    const prevFrom = dayStartUtc(addDaysKey(todayKey, -1));
    return {
      range: {
        preset: "today",
        label: `Hari Ini (${shortDateLabel(todayKey)})`,
        from,
        to,
        prevFrom,
        prevTo: from,
      },
    };
  }

  if (input.preset === "7d" || input.preset === "30d") {
    const days = input.preset === "7d" ? 7 : 30;
    const from = dayStartUtc(addDaysKey(todayKey, 1 - days));
    const to = dayStartUtc(addDaysKey(todayKey, 1));
    return {
      range: {
        preset: input.preset,
        label: `${days} Hari Terakhir`,
        from,
        to,
        prevFrom: dayStartUtc(addDaysKey(todayKey, 1 - 2 * days)),
        prevTo: from,
      },
    };
  }

  // Rentang kustom: kedua tanggal wajib valid, from tidak boleh di atas to.
  const fromKey = input.from ?? "";
  const toKey = input.to ?? "";
  if (!isValidDateKey(fromKey) || !isValidDateKey(toKey)) {
    return { error: "Rentang tanggal tidak valid. Gunakan format Tahun-Bulan-Tanggal." };
  }
  if (Date.parse(fromKey) > Date.parse(toKey)) {
    return { error: "Tanggal mulai tidak boleh di atas tanggal selesai." };
  }
  const from = dayStartUtc(fromKey);
  const to = dayStartUtc(addDaysKey(toKey, 1));
  const days = Math.round((to.getTime() - from.getTime()) / DAY_MS);
  return {
    range: {
      preset: "custom",
      label: fromKey === toKey
        ? shortDateLabel(fromKey)
        : `${shortDateLabel(fromKey)} – ${shortDateLabel(toKey)}`,
      from,
      to,
      prevFrom: dayStartUtc(addDaysKey(fromKey, -days)),
      prevTo: from,
    },
  };
}

// ==== Util agregasi ====

function dayLabel(key: string): string {
  const [, m, d] = key.split("-").map(Number);
  return `${d} ${MONTHS_ID[m - 1]}`;
}

// Label waktu dengan pemisah ":" (Intl id menyajikannya "09.12").
function formatJakartaDateTime(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: DASH_TZ,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date).replace(/\./g, ":");
}

function formatPercent(delta: number): string {
  const rounded = Math.round(delta * 10) / 10;
  return `${rounded > 0 ? "+" : ""}${rounded.toLocaleString("id-ID")}%`;
}

function trendOf(current: number, previous: number): {
  trendLabel: string;
  trendDirection: KpiTrendDirection;
} {
  if (previous <= 0) {
    if (current > 0) {
      return { trendLabel: "Baru", trendDirection: "up" };
    }
    return { trendLabel: "-", trendDirection: "flat" };
  }
  const delta = ((current - previous) / previous) * 100;
  if (Math.round(delta * 10) === 0) {
    return { trendLabel: "0%", trendDirection: "flat" };
  }
  return {
    trendLabel: formatPercent(delta),
    trendDirection: delta > 0 ? "up" : "down",
  };
}

function currencyFootnote(current: number, previous: number): string {
  if (previous <= 0) {
    return current > 0
      ? "Periode sebelumnya belum ada penjualan"
      : "Belum ada penjualan pada kedua periode";
  }
  if (current === previous) {
    return "Sama dengan periode sebelumnya";
  }
  const diff = current - previous;
  return diff > 0
    ? `Naik ${formatRupiah(diff)} dari periode sebelumnya`
    : `Turun ${formatRupiah(-diff)} dari periode sebelumnya`;
}

function countFootnote(current: number, previous: number, unit: string): string {
  if (current === previous) {
    return "Sama dengan periode sebelumnya";
  }
  const diff = current - previous;
  return diff > 0
    ? `Naik ${diff} berbanding ${previous} ${unit} sebelumnya`
    : `Turun ${-diff} berbanding ${previous} ${unit} sebelumnya`;
}

// ==== Query tiap panel ====

// Definisi penjualan (REPORT-01): dibayar, tidak dibatalkan, batas createdAt.
const PAID_ORDER_WHERE = {
  status: { not: "CANCELED" as const },
  payment: { status: "PAID" as const },
};

type PaidOrderStats = {
  total: number;
  count: number;
  buckets: Map<string, { sales: number; orders: number }>;
};

async function loadPaidOrderStats(
  from: Date,
  to: Date,
): Promise<PaidOrderStats> {
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: from, lt: to }, ...PAID_ORDER_WHERE },
    select: { createdAt: true, total: true },
  });

  const stats: PaidOrderStats = { total: 0, count: orders.length, buckets: new Map() };
  for (const order of orders) {
    const total = Number(order.total);
    stats.total += total;
    const key = jakartaDateKey(order.createdAt);
    const bucket = stats.buckets.get(key) ?? { sales: 0, orders: 0 };
    bucket.sales += total;
    bucket.orders += 1;
    stats.buckets.set(key, bucket);
  }
  return stats;
}

// Kartu KPI + pembanding periode sebelumnya (AC-ADMIN-DASH-01-03).
export async function getDashboardKpis(
  range: DashboardRange,
): Promise<KpiCardData[]> {
  const [current, previous, waitingCurrent, waitingPrevious] = await Promise.all([
    loadPaidOrderStats(range.from, range.to),
    loadPaidOrderStats(range.prevFrom, range.prevTo),
    prisma.order.count({
      where: { createdAt: { gte: range.from, lt: range.to }, status: "WAITING_PAYMENT" },
    }),
    prisma.order.count({
      where: { createdAt: { gte: range.prevFrom, lt: range.prevTo }, status: "WAITING_PAYMENT" },
    }),
  ]);

  const avgCurrent = current.count === 0 ? 0 : current.total / current.count;
  const avgPrevious = previous.count === 0 ? 0 : previous.total / previous.count;
  const waiting = trendOf(waitingCurrent, waitingPrevious);

  return [
    {
      label: "Penjualan",
      value: current.total,
      valueFormat: "currency",
      ...trendOf(current.total, previous.total),
      footnote: currencyFootnote(current.total, previous.total),
    },
    {
      label: "Transaksi",
      value: current.count,
      valueFormat: "count",
      ...trendOf(current.count, previous.count),
      footnote: countFootnote(current.count, previous.count, "transaksi"),
    },
    {
      label: "Rata-rata Nilai Pesanan",
      value: avgCurrent,
      valueFormat: "currency",
      ...trendOf(avgCurrent, avgPrevious),
      footnote: currencyFootnote(avgCurrent, avgPrevious),
    },
    {
      label: "Menunggu Pembayaran",
      value: waitingCurrent,
      valueFormat: "count",
      ...waiting,
      footnote: countFootnote(waitingCurrent, waitingPrevious, "pesanan"),
      href: "/admin/orders?status=WAITING_PAYMENT",
    },
  ];
}

// Deret harian penjualan & jumlah pesanan (AC-ADMIN-DASH-01-02); hari tanpa
// transaksi tetap berisi titik kosong supaya garis tidak melenceng.
export async function getDashboardSeries(
  range: DashboardRange,
): Promise<SalesPoint[]> {
  const stats = await loadPaidOrderStats(range.from, range.to);

  const points: SalesPoint[] = [];
  let fromKey = jakartaDateKey(range.from);
  const toKey = jakartaDateKey(new Date(range.to.getTime() - HOUR_MS));
  while (fromKey <= toKey) {
    const bucket = stats.buckets.get(fromKey) ?? { sales: 0, orders: 0 };
    points.push({ label: dayLabel(fromKey), ...bucket });
    fromKey = addDaysKey(fromKey, 1);
  }
  return points;
}

// Panel perlu tindakan: angka operasional lintas periode (pesanan yang tetap
// menunggu admin berhenti berumur rentang). Jumlah refund sengaja belum
// masuk — spek menambahkannya hanya bila alurnya ada tindakan tertunda.
export async function getDashboardActions(): Promise<ActionNeededItem[]> {
  const [processing, cancelRequested, lowStock] = await Promise.all([
    prisma.order.count({ where: { status: "PROCESSING" } }),
    prisma.order.count({ where: { status: "CANCEL_REQUESTED" } }),
    prisma.product.count({ where: { totalStock: { lte: 5 } } }),
  ]);

  return [
    {
      label: "Perlu Dikirim",
      description: "Pesanan berstatus Diproses menunggu pengiriman",
      count: processing,
      href: "/admin/orders?status=PROCESSING",
      tone: "primary",
    },
    {
      label: "Pengajuan Pembatalan",
      description: "Menunggu verifikasi sebelum diproses",
      count: cancelRequested,
      href: "/admin/orders?status=CANCEL_REQUESTED",
      tone: "destructive",
    },
    {
      label: "Stok Menipis",
      description: "Produk sisa stok 5 atau kurang",
      count: lowStock,
      href: "/admin/reports",
      tone: "muted",
    },
  ];
}

// Pesanan terbaru lintas periode (daftar operasional, AC-ADMIN-DASH-01-05).
export async function getDashboardRecentOrders(): Promise<RecentOrderRow[]> {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      orderNumber: true,
      total: true,
      status: true,
      createdAt: true,
      guestPhone: true,
      payment: { select: { status: true } },
      user: { select: { name: true, email: true } },
      _count: { select: { items: true } },
    },
  });

  const paymentLabels: Record<string, string> = {
    PENDING: "Menunggu",
    PAID: "Lunas",
    EXPIRED: "Kedaluwarsa",
    FAILED: "Gagal",
  };

  return orders.map((order) => ({
    code: order.orderNumber,
    buyer: order.user
      ? (order.user.email ?? order.user.name)
      : (order.guestPhone ?? "Guest"),
    itemCount: order._count.items,
    paymentMethod: order.payment
      ? (paymentLabels[order.payment.status] ?? order.payment.status)
      : "Tanpa pembayaran",
    total: Number(order.total),
    status: order.status,
    date: formatJakartaDateTime(order.createdAt),
    href: `/admin/orders/${order.id}`,
  }));
}

// Produk terlaris: agregasi OrderItem per produk (5 teratas menurut unit).
export async function getDashboardTopProducts(
  range: DashboardRange,
): Promise<TopProductRow[]> {
  const items = await prisma.orderItem.findMany({
    where: { order: { createdAt: { gte: range.from, lt: range.to }, ...PAID_ORDER_WHERE } },
    select: { productName: true, variantName: true, quantity: true, price: true },
  });

  const byProduct = new Map<
    string,
    { sold: number; revenue: number; variants: Set<string> }
  >();
  for (const item of items) {
    const entry = byProduct.get(item.productName) ?? {
      sold: 0,
      revenue: 0,
      variants: new Set<string>(),
    };
    entry.sold += item.quantity;
    entry.revenue += Number(item.price) * item.quantity;
    entry.variants.add(item.variantName);
    byProduct.set(item.productName, entry);
  }

  const top = [...byProduct.entries()]
    .sort((a, b) => b[1].sold - a[1].sold)
    .slice(0, 5);
  if (top.length === 0) return [];

  // Kategori & status produk sekarang (nama snapshot bisa jadi produk sudah
  // diubah/dihapus — tampil tanpa kategori bila tidak ditemukan).
  const products = await prisma.product.findMany({
    where: { name: { in: top.map(([name]) => name) } },
    select: { id: true, name: true, status: true, category: { select: { name: true } } },
  });
  const now = new Map(products.map((product) => [product.name, product]));

  return top.map(([name, stats], index) => {
    const live = now.get(name);
    return {
      rank: index + 1,
      name,
      meta: stats.variants.size === 1
        ? "1 varian terjual"
        : `${stats.variants.size} varian terjual`,
      sold: stats.sold,
      revenue: stats.revenue,
      category: live?.category.name ?? "-",
      status: live?.status ?? "DRAFT",
      href: live ? `/admin/products/${live.id}/edit` : null,
    };
  });
}
