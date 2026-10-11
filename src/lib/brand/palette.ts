// SITE-05 (PH-09): data palet warna yang dipakai bersama server dan client.
// Modul ini sengaja bebas Prisma/Next agar aman diimpor Client Component.

export type BrandPalette = {
  primaryColor: string | null;
  primaryFg: string | null;
  secondaryColor: string | null;
  secondaryFg: string | null;
  accentColor: string | null;
  accentFg: string | null;
  backgroundColor: string | null;
  foregroundColor: string | null;
  mutedColor: string | null;
  mutedFg: string | null;
  borderColor: string | null;
  destructiveColor: string | null;
  destructiveFg: string | null;
  successColor: string | null;
  successFg: string | null;
};

export type PaletteKey = keyof BrandPalette;

// Pemetaan slot palet ke variabel CSS di globals.css. Token sekunder (card,
// popover, input, ring) sengaja tidak termasuk.
export const PALETTE_FIELDS: {
  key: PaletteKey;
  label: string;
  cssVar: string;
}[] = [
  { key: "primaryColor", label: "Primary", cssVar: "--primary" },
  { key: "primaryFg", label: "Primary (teks)", cssVar: "--primary-foreground" },
  { key: "secondaryColor", label: "Secondary", cssVar: "--secondary" },
  {
    key: "secondaryFg",
    label: "Secondary (teks)",
    cssVar: "--secondary-foreground",
  },
  { key: "accentColor", label: "Accent", cssVar: "--accent" },
  { key: "accentFg", label: "Accent (teks)", cssVar: "--accent-foreground" },
  { key: "backgroundColor", label: "Background", cssVar: "--background" },
  { key: "foregroundColor", label: "Foreground", cssVar: "--foreground" },
  { key: "mutedColor", label: "Muted", cssVar: "--muted" },
  { key: "mutedFg", label: "Muted (teks)", cssVar: "--muted-foreground" },
  { key: "borderColor", label: "Border", cssVar: "--border" },
  { key: "destructiveColor", label: "Destructive", cssVar: "--destructive" },
  {
    key: "destructiveFg",
    label: "Destructive (teks)",
    cssVar: "--destructive-foreground",
  },
  { key: "successColor", label: "Success", cssVar: "--success" },
  { key: "successFg", label: "Success (teks)", cssVar: "--success-foreground" },
];

export const EMPTY_PALETTE: BrandPalette = {
  primaryColor: null,
  primaryFg: null,
  secondaryColor: null,
  secondaryFg: null,
  accentColor: null,
  accentFg: null,
  backgroundColor: null,
  foregroundColor: null,
  mutedColor: null,
  mutedFg: null,
  borderColor: null,
  destructiveColor: null,
  destructiveFg: null,
  successColor: null,
  successFg: null,
};

// Variabel CSS yang menimpa `:root` di globals.css. Hanya slot terisi
// (non-null) yang dikirim; sisanya tetap memakai nilai bawaan.
export function brandCssVariables(
  palette: BrandPalette,
): Record<string, string> {
  const variables: Record<string, string> = {};
  for (const field of PALETTE_FIELDS) {
    const value = palette[field.key];
    if (value) variables[field.cssVar] = value;
  }
  return variables;
}
