// Token khusus dashboard-v2 (prototipe ADMIN-DASH-01).
//
// Palet mockup Figma memakai netral ber-tone hijau (bukan abu murni). Nilai
// hijau di sini HANYA fallback: bila Site Admin sudah mengisi palet brand
// (SITE-05), nilai Site Admin yang dipakai. Jadi kustomisasi tetap menang.
//
// Dipakai dua arah dari satu sumber:
//   - `cssVars`: disuntikkan sebagai inline style di wrapper (menimpa :root
//     hanya di dalam scope dashboard, tidak menyentuh app lain).
//   - `colors`: resolusi hex final, dikirim ke chart recharts (SVG recharts
//     tidak andal memakai var() di atribut stroke/fill, jadi dikirim nilai
//     konkret).
import type { BrandPalette } from "@/lib/brand/palette";

// Netral ber-tone hijau hasil eyedrop dari frame mockup Figma.
export const DASHBOARD_GREEN_DEFAULTS = {
  primary: "#36745B",
  primaryForeground: "#FFFFFF",
  foreground: "#202725",
  mutedForeground: "#77807B",
  border: "#E7EAE8",
  background: "#FCFCFD",
  muted: "#F3F4F4",
  accent: "#EDF4EF",
  accentForeground: "#202725",
  card: "#FFFFFF",
} as const;

type DashboardColors = { [K in keyof typeof DASHBOARD_GREEN_DEFAULTS]: string };

export type DashboardTokens = {
  // Custom property (--primary dst) tidak dikenal CSSProperties, jadi dipetakan
  // sebagai Record<string, string> dan di-cast di tempat pemakaian.
  cssVars: Record<string, string>;
  colors: DashboardColors;
};

// Nilai palet bila terisi; jika null pakai fallback hijau.
function pick(paletteValue: string | null, fallback: string): string {
  return paletteValue?.trim() ? paletteValue : fallback;
}

export function dashboardTokens(palette: BrandPalette): DashboardTokens {
  const colors: DashboardColors = {
    primary: pick(palette.primaryColor, DASHBOARD_GREEN_DEFAULTS.primary),
    primaryForeground: pick(
      palette.primaryFg,
      DASHBOARD_GREEN_DEFAULTS.primaryForeground,
    ),
    foreground: pick(
      palette.foregroundColor,
      DASHBOARD_GREEN_DEFAULTS.foreground,
    ),
    mutedForeground: pick(palette.mutedFg, DASHBOARD_GREEN_DEFAULTS.mutedForeground),
    border: pick(palette.borderColor, DASHBOARD_GREEN_DEFAULTS.border),
    background: pick(
      palette.backgroundColor,
      DASHBOARD_GREEN_DEFAULTS.background,
    ),
    muted: pick(palette.mutedColor, DASHBOARD_GREEN_DEFAULTS.muted),
    accent: pick(palette.accentColor, DASHBOARD_GREEN_DEFAULTS.accent),
    accentForeground: pick(
      palette.accentFg,
      DASHBOARD_GREEN_DEFAULTS.accentForeground,
    ),
    card: "#FFFFFF",
  };

  // Hanya slot terisi (non-null) yang dikirim sebagai custom property supaya
  // fallback hijau tidak menimpa :root untuk slot yang belum diatur. Nilai
  // konkret (bukan var()) dipakai agar inline style selalu mengalahkan
  // aturan :root di globals.css.
  const cssVars: Record<string, string> = {
    "--primary": colors.primary,
    "--primary-foreground": colors.primaryForeground,
    "--foreground": colors.foreground,
    "--muted-foreground": colors.mutedForeground,
    "--border": colors.border,
    "--background": colors.background,
    "--muted": colors.muted,
    "--accent": colors.accent,
    "--accent-foreground": colors.accentForeground,
    "--card": colors.card,
    "--ring": colors.primary,
  };

  return { cssVars, colors };
}
