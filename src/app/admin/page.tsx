import Link from "next/link";
import { connection } from "next/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KpiCards } from "@/components/admin/dashboard/KpiCards";
import { SalesTrendChart } from "@/components/admin/dashboard/SalesTrendChart";
import { ActionNeededPanel } from "@/components/admin/dashboard/ActionNeededPanel";
import { RecentOrdersTable } from "@/components/admin/dashboard/RecentOrdersTable";
import { TopProductsPanel } from "@/components/admin/dashboard/TopProductsPanel";
import {
  getDashboardActions,
  getDashboardKpis,
  getDashboardRecentOrders,
  getDashboardSeries,
  getDashboardTopProducts,
  resolveDashboardRange,
} from "@/lib/admin/dashboard-queries";
import { dashboardTokens } from "@/lib/admin/dashboard-tokens";
import { countOrdersByStatus } from "@/lib/orders";
import { getBrandSetting } from "@/lib/brand";

// Dasbor modern Store Admin (ADMIN-DASH-01, PH-12): sumber data asli lewat
// lib/admin/dashboard-queries (definisi mengikuti REPORT-01). Visual basis
// prototipe dashboard-v2: token brand (SITE-05) disuntikkan di wrapper ini dan
// font Inter menyesuaikan mockup Figma.
export const instant = false;

// Zona waktu dasbor (keputusan docs/04 bagian 10): Asia/Jakarta.
const DASH_TZ = "Asia/Jakarta";

function jakartaDateKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: DASH_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

// Footer dasbor: waktu pembaruan data terakhir.
function updatedAtLabel(): string {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: DASH_TZ,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(new Date())
    .replace(/\./g, ":");
}

const PRESET_LINKS: { key: "today" | "7d" | "30d"; label: string }[] = [
  { key: "today", label: "Hari Ini" },
  { key: "7d", label: "7 Hari" },
  { key: "30d", label: "30 Hari" },
];

// Fallback panel gagal (AC: kegagalan satu panel tidak menghilangkan panel
// lain; data lain jangan disembunyikan atau dipalsukan nol).
function PanelError({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">{title}</p>
      <Alert variant="destructive">
        Panel gagal dimuat. Muat ulang halaman — panel lain tetap tampil.
      </Alert>
    </div>
  );
}

type PageProps = {
  searchParams: Promise<{ preset?: string; from?: string; to?: string }>;
};

export default async function AdminIndexPage({ searchParams }: PageProps) {
  // Rentang memakai waktu sekarang, jadi dasbor harus dirender saat request
  // (bukan prerender) dan data selalu segar.
  await connection();

  const params = await searchParams;
  // Tanpa filter apa pun: default 30 hari terakhir (selaras dasbor lama).
  if (!params.preset && !params.from && !params.to) {
    params.preset = "30d";
  }
  const parsed = resolveDashboardRange(params);

  const [brand, statusCounts] = await Promise.all([
    getBrandSetting(),
    countOrdersByStatus().catch(() => null),
  ]);
  const { cssVars, colors } = dashboardTokens(brand.palette);

  const dashboardStyle = {
    ...cssVars,
    fontFamily:
      "var(--font-inter), var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  } as React.CSSProperties;

  if ("error" in parsed) {
    // Rentang kustom tidak valid: pesan jelas, TANPA menjalankan query berbahaya.
    return (
      <div style={dashboardStyle} className="flex flex-col gap-6">
        <PageHeader
          title="Dasbor"
          description="Ringkasan dan hal yang butuh perhatian."
        />
        <Alert variant="destructive">{parsed.error}</Alert>
      </div>
    );
  }
  const range = parsed.range;

  // Panel paralel; kegagalan satu panel berhenti di panel itu saja.
  const [kpis, series, actions, recent, top] = await Promise.allSettled([
    getDashboardKpis(range),
    getDashboardSeries(range),
    getDashboardActions(),
    getDashboardRecentOrders(),
    getDashboardTopProducts(range),
  ]);

  const fromKey = jakartaDateKey(range.from);
  const toKey = jakartaDateKey(new Date(range.to.getTime() - 1));

  return (
    <div style={dashboardStyle} className="flex flex-col gap-6">
      <PageHeader
        title="Dasbor"
        description={`Periode: ${range.label} · zona waktu Jakarta (WIB)`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter periode menggantikan tombol "Laporan Lengkap" (dihapus
                atas keputusan pengguna 2026-10-19: hanya mengarah ke halaman
                laporan, kurang berfungsi). Preset = link server-side. */}
            <div
              className="flex items-center rounded-lg border border-border p-0.5"
              role="group"
              aria-label="Periode dasbor"
            >
              {PRESET_LINKS.map((preset) => {
                const active = range.preset === preset.key;
                return (
                  <Link
                    key={preset.key}
                    href={`/admin?preset=${preset.key}`}
                    aria-pressed={active}
                    className={
                      "flex h-[30px] items-center rounded-md px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
                      (active
                        ? ""
                        : "text-muted-foreground hover:text-foreground")
                    }
                    style={
                      active ? { backgroundColor: colors.primary, color: colors.primaryForeground } : undefined
                    }
                  >
                    {preset.label}
                  </Link>
                );
              })}
            </div>

            <form
              method="get"
              action="/admin"
              className="flex flex-wrap items-center gap-2"
            >
              <label className="sr-only" htmlFor="dashboard-from">
                Tanggal mulai
              </label>
              <Input
                id="dashboard-from"
                type="date"
                name="from"
                defaultValue={fromKey}
                className="h-9 w-auto text-xs"
              />
              <label className="sr-only" htmlFor="dashboard-to">
                Tanggal selesai
              </label>
              <Input
                id="dashboard-to"
                type="date"
                name="to"
                defaultValue={toKey}
                className="h-9 w-auto text-xs"
              />
              <Button type="submit" variant="outline" size="sm" className="h-9">
                Terapkan
              </Button>
            </form>
          </div>
        }
      />

      {/* Kartu KPI + pembanding periode sebelumnya. */}
      {kpis.status === "fulfilled" ? (
        <KpiCards cards={kpis.value} />
      ) : (
        <PanelError title="Kartu KPI" />
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {series.status === "fulfilled" ? (
            <SalesTrendChart
              series={series.value}
              title="Tren Penjualan"
              description="Penjualan dan jumlah pesanan per hari dalam periode terpilih."
              colors={colors}
            />
          ) : (
            <PanelError title="Grafik Tren Penjualan" />
          )}
        </div>
        {actions.status === "fulfilled" ? (
          <ActionNeededPanel
            items={actions.value}
            title="Perlu Tindakan"
            description="Hal yang menunggu tindakan Anda."
          />
        ) : (
          <PanelError title="Panel Perlu Tindakan" />
        )}
      </div>

      {/* Pesanan terbaru: daftar operasional lintas periode. Angka tab status
          kumulatif seluruh waktu dari server (pengganti card "Pesanan per
          Status" yang dihapus — keputusan pengguna 2026-10-18). */}
      {recent.status === "fulfilled" ? (
        <RecentOrdersTable
          orders={recent.value}
          title="Pesanan Terbaru"
          description="Pesanan paling baru beserta status pembayarannya."
          viewAllHref="/admin/orders"
          statusTotals={statusCounts ?? undefined}
        />
      ) : (
        <PanelError title="Panel Pesanan Terbaru" />
      )}

      {top.status === "fulfilled" ? (
        <TopProductsPanel
          products={top.value}
          title="Produk Terlaris"
          description={`Top 5 produk berdasarkan unit terjual · ${range.label}`}
          viewAllHref="/admin/products"
        />
      ) : (
        <PanelError title="Panel Produk Terlaris" />
      )}

      {/* Footer status data — selaras mockup Figma (footer global halaman). */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-1.5 w-1.5 rounded-full bg-success"
            aria-hidden="true"
          />
          Semua data sudah diperbarui
        </span>
        <span>Terakhir diperbarui {updatedAtLabel()}</span>
      </div>
    </div>
  );
}
