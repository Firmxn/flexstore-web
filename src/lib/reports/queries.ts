import { prisma } from "@/lib/db/prisma";

// REPORT-01 (PH-06) — lima laporan PRD 4.11: penjualan, kinerja produk, stok,
// pesanan, dan refund. Agregasi dilakukan di JavaScript atas baris yang sudah
// disaring Prisma (tanpa raw SQL), cukup untuk skala MVP.

export type ReportRange = { from: Date; to: Date };

export type ReportRangeInput = { from?: Date; to?: Date };

const DAY_MS = 24 * 60 * 60 * 1000;

export function resolveReportRange(input: ReportRangeInput): ReportRange {
  const to = input.to ?? new Date();
  const from = input.from ?? new Date(to.getTime() - 30 * DAY_MS);
  return { from, to };
}

// 1. Laporan penjualan: transaksi berhasil (sudah dibayar) dan nilai penjualan.
export async function getSalesReport(range: ReportRange) {
  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: range.from, lte: range.to },
      status: { not: "CANCELED" },
      payment: { status: "PAID" },
    },
    select: {
      subtotal: true,
      shippingCost: true,
      discount: true,
      total: true,
    },
  });

  const summary = orders.reduce(
    (acc, order) => {
      acc.subtotal += Number(order.subtotal);
      acc.shipping += Number(order.shippingCost);
      acc.discount += Number(order.discount);
      acc.total += Number(order.total);
      return acc;
    },
    { subtotal: 0, shipping: 0, discount: 0, total: 0 },
  );

  return { count: orders.length, ...summary };
}

// 2. Kinerja produk: kuantitas dan nilai per varian terjual.
export async function getProductPerformanceReport(range: ReportRange) {
  const items = await prisma.orderItem.findMany({
    where: {
      order: {
        createdAt: { gte: range.from, lte: range.to },
        status: { not: "CANCELED" },
        payment: { status: "PAID" },
      },
    },
    select: {
      productName: true,
      variantName: true,
      quantity: true,
      price: true,
    },
  });

  const map = new Map<
    string,
    { productName: string; variantName: string; quantity: number; revenue: number }
  >();
  for (const item of items) {
    const key = `${item.productName}::${item.variantName}`;
    const entry =
      map.get(key) ??
      {
        productName: item.productName,
        variantName: item.variantName,
        quantity: 0,
        revenue: 0,
      };
    entry.quantity += item.quantity;
    entry.revenue += Number(item.price) * item.quantity;
    map.set(key, entry);
  }

  return [...map.values()].sort((a, b) => b.quantity - a.quantity);
}

// 3. Laporan stok: total stok per produk + penanda stok menipis.
export const LOW_STOCK_THRESHOLD = 5;

export async function getStockReport() {
  const products = await prisma.product.findMany({
    orderBy: { totalStock: "asc" },
    select: {
      id: true,
      name: true,
      status: true,
      totalStock: true,
      variants: { select: { stock: true } },
    },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    status: product.status,
    totalStock: product.totalStock,
    variantCount: product.variants.length,
    lowStock: product.totalStock <= LOW_STOCK_THRESHOLD,
  }));
}

// 4. Laporan pesanan: jumlah per status dalam rentang.
export async function getOrderReport(range: ReportRange) {
  const rows = await prisma.order.groupBy({
    by: ["status"],
    where: { createdAt: { gte: range.from, lte: range.to } },
    _count: { _all: true },
  });

  return rows.map((row) => ({ status: row.status, count: row._count._all }));
}

// 5. Laporan refund: jumlah dan nilai per status.
export async function getRefundReport(range: ReportRange) {
  const refunds = await prisma.refund.findMany({
    where: { createdAt: { gte: range.from, lte: range.to } },
    select: { status: true, amount: true },
  });

  const map = new Map<string, { status: string; count: number; amount: number }>();
  for (const refund of refunds) {
    const entry =
      map.get(refund.status) ?? { status: refund.status, count: 0, amount: 0 };
    entry.count += 1;
    entry.amount += Number(refund.amount);
    map.set(refund.status, entry);
  }

  return [...map.values()].sort((a, b) => a.status.localeCompare(b.status));
}

export async function getReportBundle(input: ReportRangeInput) {
  const range = resolveReportRange(input);
  const [sales, products, stock, orders, refunds] = await Promise.all([
    getSalesReport(range),
    getProductPerformanceReport(range),
    getStockReport(),
    getOrderReport(range),
    getRefundReport(range),
  ]);

  return { range, sales, products, stock, orders, refunds };
}
