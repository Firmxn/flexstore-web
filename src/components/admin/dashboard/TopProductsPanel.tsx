"use client";

// Produk Terlaris — tabel top 5 produk (ADMIN-DASH-01 poin 6).
//
// Prototipe UI tanpa backend: data dari mock. Sengaja tanpa search/filter/
// pagination — daftarnya pendek dan tetap; pintasan lengkap ada di tombol
// "Lihat semua". Struktur kolom mengikuti mockup Figma: #, Produk (avatar +
// nama + meta), Terjual (bisa diurut), Pendapatan, Kategori, Status, aksi.
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, Ellipsis, Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah, PRODUCT_STATUS_LABELS } from "@/lib/utils/format";
import type { ProductStatus } from "@prisma/client";
import type { TopProductRow } from "@/lib/admin/dashboard-queries";

// Badge status produk (data nyata) — latar tint halus berbasis token,
// pasangan gaya dengan daftar Pesanan Terbaru.
type SoftProductVariant = "softPrimary" | "softNeutral" | "softSuccess" | "softDestructive";

const STATUS_BADGE: Record<ProductStatus, SoftProductVariant> = {
  ACTIVE: "softSuccess",
  INACTIVE: "softNeutral",
  DRAFT: "softNeutral",
  OUT_OF_STOCK: "softDestructive",
  DISCONTINUED: "softDestructive",
};

type SortDir = "asc" | "desc";

// Inisial avatar: huruf depan dua kata pertama nama produk
// (mis. "Kemeja Flannel Oversize" -> "KF").
function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
}

export function TopProductsPanel({
  products,
  title,
  description,
  viewAllHref,
  viewAllLabel = "Lihat semua",
}: {
  products: TopProductRow[];
  title: string;
  description?: string;
  viewAllHref: string;
  viewAllLabel?: string;
}) {
  // Urutan kolom "Terjual" (default turun-menurun, selaras mockup ADMIN-DASH-01).
  const [dir, setDir] = useState<SortDir>("desc");

  const rows = useMemo(() => {
    const sorted = [...products].sort((a, b) => a.sold - b.sold);
    return dir === "desc" ? sorted.reverse() : sorted;
  }, [products, dir]);

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
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            {viewAllLabel}
          </Link>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Heading kolom memakai huruf biasa (tanpa uppercase) — selaras mockup.
            Kelas inline (bukan export ui/table) supaya dasbor tidak bergantung
            pada kelengkapan ui/table versi yang saat ini ter-commit di repo
            (deploy 2026-10-19 gagal karena export ui table belum ter-commit). */}
        <Table wrapperClassName="rounded-none border-0">
          <TableHeader className="[&_th]:normal-case [&_th]:tracking-normal [&_th]:font-medium">
            <TableRow className="border-t border-border hover:bg-transparent">
              <TableHead className="pl-4">No.</TableHead>
              <TableHead>Produk</TableHead>
              <TableHead className="text-right">
                <button
                  type="button"
                  onClick={() => setDir((d) => (d === "desc" ? "asc" : "desc"))}
                  className="inline-flex items-center gap-1 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Urutkan menurut unit terjual"
                >
                  Terjual
                  {dir === "desc" ? (
                    <ArrowDown className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
                  ) : (
                    <ArrowUp className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
                  )}
                </button>
              </TableHead>
              <TableHead className="text-right">Pendapatan</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10 pr-4">
                <span className="sr-only">Aksi</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  Tidak ada produk terjual pada periode ini.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((product) => (
                <TableRow key={product.name}>
                  <TableCell className="pl-4 tabular-nums">{product.rank}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-3">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground"
                        aria-hidden="true"
                      >
                        {initials(product.name)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium">
                          {product.name}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {product.meta}
                        </span>
                      </span>
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {product.sold}
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {formatRupiah(product.revenue)}
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    {/* Badge status produk sekarang (bukan selalu "Terlaris")
                        supaya admin tahu kondisi produk yang laris. */}
                    <Badge
                      variant={STATUS_BADGE[product.status]}
                      className="gap-1.5 font-medium"
                    >
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-current"
                        aria-hidden="true"
                      />
                      {PRODUCT_STATUS_LABELS[product.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label={`Aksi untuk produk ${product.name}`}
                        >
                          <Ellipsis className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {product.href ? (
                          <DropdownMenuItem asChild>
                            {/* Detail produk asli (UUID) bila produk masih ada. */}
                            <Link href={product.href}>
                              <Eye aria-hidden="true" />
                              Lihat detail
                            </Link>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem disabled>
                            <Eye aria-hidden="true" />
                            Produk tidak ditemukan
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
