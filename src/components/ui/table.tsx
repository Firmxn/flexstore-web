import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Table({
  className,
  wrapperClassName,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement> & {
  /** Kelas untuk pembungkus scroll (mis. "rounded-none border-0" agar tabel
   *  menyatu dengan card tanpa radius/border sendiri). */
  wrapperClassName?: string;
}) {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-lg border border-border",
        wrapperClassName,
      )}
    >
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("bg-muted/50", className)} {...props} />;
}

/** Override kepala kolom bergaya "plain" (sentence case, bukan uppercase) untuk
 *  tabel dasbor — dipakai bersama panel Pesanan Terbaru & Produk Terlaris agar
 *  gaya dan ukurannya seragam. Ukuran tetap `text-xs` (12px) dari TableHead. */
export const TABLE_HEAD_PLAIN =
  "[&_th]:normal-case [&_th]:tracking-normal [&_th]:font-medium";

export function TableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  );
}

export function TableRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn("border-b border-border transition-colors", className)}
      {...props}
    />
  );
}

export function TableHead({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wide text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("px-4 py-3 align-middle", className)} {...props} />
  );
}
