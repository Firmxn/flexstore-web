import type { ProductStatus } from "@prisma/client";

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function formatRupiah(value: number | string): string {
  const amount = typeof value === "string" ? Number(value) : value;
  return rupiah.format(Number.isFinite(amount) ? amount : 0);
}

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  ACTIVE: "Aktif",
  INACTIVE: "Tidak Aktif",
  DRAFT: "Draft",
  OUT_OF_STOCK: "Stok Habis",
  DISCONTINUED: "Dihentikan",
};

export function formatDateTime(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
