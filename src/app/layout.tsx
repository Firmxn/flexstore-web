import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { brandTagline, getBrandSetting } from "@/lib/brand";
import { brandCssVariables } from "@/lib/brand/palette";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SITE-05 (PH-09): judul, deskripsi, dan favicon mengikuti identitas brand yang
// diatur Site Admin. Dibaca per permintaan supaya perubahan langsung berlaku.
export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrandSetting();

  return {
    title: {
      default: brand.brandName,
      template: `%s | ${brand.brandName}`,
    },
    description: brandTagline(brand),
    icons: brand.faviconUrl ? { icon: brand.faviconUrl } : undefined,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const brand = await getBrandSetting();
  // Palet disuntikkan sebagai custom properties pada <html>; inline style
  // mengalahkan aturan `:root` di globals.css. Nilainya sudah divalidasi Zod
  // (hex #RRGGBB), jadi tidak perlu dangerouslySetInnerHTML.
  const cssVariables = brandCssVariables(
    brand.palette,
  ) as unknown as CSSProperties;

  return (
    <html
      lang="id"
      style={cssVariables}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
