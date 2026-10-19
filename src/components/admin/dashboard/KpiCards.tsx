import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { formatRupiah } from "@/lib/utils/format";
import type { KpiCardData } from "@/lib/admin/dashboard-queries";

// Format nilai KPI: mata uang penuh (formatRupiah) atau angka biasa.
function formatKpiValue(card: KpiCardData): string {
  return card.valueFormat === "currency"
    ? formatRupiah(card.value)
    : card.value.toLocaleString("id-ID");
}

// Ikon panah tren kecil (SVG inline) — arah naik/turun.
function TrendArrow({ direction }: { direction: KpiCardData["trendDirection"] }) {
  if (direction === "flat") {
    return (
      <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
        <path
          d="M2 6h8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
      <path
        d={direction === "up" ? "M2 8.5 6 4l4 4.5" : "M2 3.5 6 8l4-4.5"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// Warna latar ikon tren memakai token status — ikut kustomisasi palet brand.
function trendToneClass(direction: KpiCardData["trendDirection"]) {
  if (direction === "up") return "bg-success/10 text-success";
  if (direction === "down") return "bg-destructive/10 text-destructive";
  return "bg-muted text-muted-foreground";
}

function KpiCardBody({ card }: { card: KpiCardData }) {
  return (
    // h-full: kartu yang dibungkus Link (kartu KPI bersifat shortcut) tetap
    // mengisi tinggi baris grid sama seperti kartu yang langsung menjadi
    // child grid — tingginya selalu sejajar meskipun penjelasannya berbeda
    // banyaknya baris (keputusan review 2026-10-18).
    <Card className="h-full p-4 flex flex-col justify-between">
      <p className="text-xs text-muted-foreground">{card.label}</p>
      <div className="mt-4 flex items-center gap-3">
        <p className="text-2xl font-bold tracking-tight">
          {formatKpiValue(card)}
        </p>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium",
            trendToneClass(card.trendDirection),
          )}
        >
          <TrendArrow direction={card.trendDirection} />
          {/* Label "-" saja tidak informatif (ikonnya sudah garis datar). */}
          {card.trendLabel === "-" ? null : card.trendLabel}
        </span>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">{card.footnote}</p>
    </Card>
  );
}

export function KpiCards({ cards }: { cards: KpiCardData[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) =>
        card.href ? (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring block h-full"
          >
            <KpiCardBody card={card} />
          </Link>
        ) : (
          <KpiCardBody key={card.label} card={card} />
        ),
      )}
    </div>
  );
}
