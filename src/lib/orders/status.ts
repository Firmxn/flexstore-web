import type { OrderStatus } from "@prisma/client";

// Label status pesanan untuk UI (PRD 3.1.C). PH-03 hanya membuat
// WAITING_PAYMENT; status lain dipakai PH-04 (pembayaran) dan PH-06 (kirim).
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  WAITING_PAYMENT: "Menunggu Pembayaran",
  PROCESSING: "Diproses",
  SHIPPED: "Dikirim",
  COMPLETED: "Selesai",
  CANCELED: "Dibatalkan",
};
