"use client";

// Tren penjualan — chart ComposedChart (recharts v3).
// Area "Penjualan" (sumbu kiri, kurva monotone + gradient) digabung garis
// "Pesanan" (sumbu kanan, putus-putus). Ada toggle rentang (30/7 hari) dan
// tooltip hover yang meniru mockup Figma. Data asli dari deret harian
// `getDashboardSeries()` — skala sumbu dihitung dari data, bukan skala mockup.
//
// Warna dikirim sebagai hex lewat props (bukan var()) karena atribut
// stroke/fill SVG di recharts tidak andal memakai custom property. Nilai hex
// berasal dari `dashboardTokens()` di server — mengikuti palet brand.
import { useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { formatRupiah } from "@/lib/utils/format";
import type { SalesPoint } from "@/lib/admin/dashboard-queries";

type RangeKey = "30d" | "7d";

const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: "30d", label: "30 hari" },
  { key: "7d", label: "7 hari" },
];

export type ChartColors = {
  primary: string;
  primaryForeground: string;
  border: string;
  mutedForeground: string;
  background: string;
};

// Isi tooltip meniru mockup: gelembung gelap, label tanggal, dua baris nilai.
function TrendTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{
    name?: string | number;
    value?: number | string;
    color?: string;
    stroke?: string;
    fill?: string;
    dataKey?: string | number;
  }>;
  label?: string | number;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const sales = payload.find((p) => p.dataKey === "sales");
  const orders = payload.find((p) => p.dataKey === "orders");

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-popover-foreground">{label}</p>
      <ul className="mt-1.5 flex flex-col gap-1">
        {sales ? (
          <li className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: sales.color ?? sales.stroke }}
            />
            <span className="text-muted-foreground">Penjualan</span>
            <span className="ml-auto font-semibold tabular-nums text-popover-foreground">
              {formatRupiah(Number(sales.value ?? 0))}
            </span>
          </li>
        ) : null}
        {orders ? (
          <li className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: orders.color ?? orders.stroke }}
            />
            <span className="text-muted-foreground">Pesanan</span>
            <span className="ml-auto font-semibold tabular-nums text-popover-foreground">
              {Number(orders.value ?? 0)} unit
            </span>
          </li>
        ) : null}
      </ul>
    </div>
  );
}

// Skala sumbu mengikuti data dengan tangga "bagus" (1, 2, 2.5, 5 x 10^n) dan
// tickCount 5 supaya angka tick bulat (250.000, 500.000, ...) — bukan tick
// acak seperti 865.000. Tanpa NaN saat periode kosong (AC-ADMIN-DASH-01-07).
function niceStepMax(rawMax: number): number {
  if (rawMax <= 0) return 4;
  const rawStep = (rawMax * 1.1) / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
  return step * 4;
}

function salesMax(series: SalesPoint[]): number {
  const max = Math.max(...series.map((point) => point.sales), 0);
  return max === 0 ? 1_000_000 : niceStepMax(max);
}

function ordersMax(series: SalesPoint[]): number {
  const max = Math.max(...series.map((point) => point.orders), 0);
  return Math.max(4, 4 * Math.ceil((max * 1.1) / 4));
}

// Label sumbu kiri: angka rupiah penuh pemisah ribuan (750.000) — keputusan
// review 2026-10-19: label ringkas "rb/jt" mudah melipat di area sempit.
function salesTickLabel(value: number): string {
  return value.toLocaleString("id-ID");
}

export function SalesTrendChart({
  series,
  title,
  description,
  colors,
}: {
  series: SalesPoint[];
  title: string;
  description?: string;
  colors: ChartColors;
}) {
  const [range, setRange] = useState<RangeKey>("30d");

  // 7 hari terakhir: ambil titik-titik akhir deret.
  const data = range === "7d" ? series.slice(-7) : series;
  const salesDomain = salesMax(data);
  const ordersDomain = ordersMax(data);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="text-base">{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          <div
            className="flex items-center rounded-lg border border-border p-0.5"
            role="group"
            aria-label="Rentang waktu chart"
          >
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setRange(opt.key)}
                aria-pressed={range === opt.key}
                className={cn(
                  "flex h-[30px] items-center rounded-md px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  range === opt.key
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                style={
                  range === opt.key
                    ? { backgroundColor: colors.primary }
                    : undefined
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: colors.primary }}
            />
            Penjualan (Rp)
          </li>
          <li className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: colors.mutedForeground }}
            />
            Pesanan (unit)
          </li>
        </ul>
      </CardHeader>

      <CardContent>
        <div className="h-64 w-full" role="img" aria-label={description ?? title}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={colors.primary}
                    stopOpacity={0.28}
                  />
                  <stop
                    offset="100%"
                    stopColor={colors.primary}
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>

              {/* Gridline horizontal bawaan recharts — mengikuti skala data. */}
              <CartesianGrid
                horizontal
                vertical={false}
                stroke={colors.border}
                strokeDasharray="4 4"
              />

              <XAxis
                dataKey="label"
                tick={{ fill: colors.mutedForeground, fontSize: 12 }}
                axisLine={{ stroke: colors.border }}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={24}
                padding={{ left: 30, right: 30 }}
              />

              {/* Sumbu kiri: penjualan (rupiah penuh), skala tick bagus. */}
              <YAxis
                yAxisId="sales"
                tick={{ fill: colors.mutedForeground, fontSize: 12 }}
                tickFormatter={salesTickLabel}
                domain={[0, salesDomain]}
                axisLine={false}
                tickLine={false}
                width={64}
              />

              {/* Sumbu kanan: pesanan (unit), skala dari data. */}
              <YAxis
                yAxisId="orders"
                orientation="right"
                tick={{ fill: colors.mutedForeground, fontSize: 12 }}
                domain={[0, ordersDomain]}
                axisLine={false}
                tickLine={false}
                width={28}
              />

              <Tooltip
                content={<TrendTooltip />}
                cursor={{ stroke: colors.mutedForeground, strokeWidth: 1 }}
              />

              <Area
                yAxisId="sales"
                type="monotone"
                dataKey="sales"
                name="Penjualan"
                stroke={colors.primary}
                strokeWidth={2.5}
                fill="url(#salesFill)"
                dot={{
                  r: 3,
                  fill: colors.background,
                  stroke: colors.primary,
                  strokeWidth: 2,
                }}
                activeDot={{ r: 4, strokeWidth: 2 }}
                isAnimationActive={false}
              />

              <Line
                yAxisId="orders"
                type="monotone"
                dataKey="orders"
                name="Pesanan"
                stroke={colors.mutedForeground}
                strokeWidth={1.75}
                strokeDasharray="4 4"
                dot={false}
                activeDot={{ r: 3 }}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
