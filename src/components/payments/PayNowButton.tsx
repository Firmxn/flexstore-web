"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";
import { FormErrorAlert } from "@/components/ui/form-error-alert";

type PayNowButtonProps = {
  orderId: string;
  // Nomor HP wajib untuk pesanan guest; kosong untuk pesanan customer.
  phone?: string;
};

// Membuat pembayaran Xendit lalu mengalihkan ke halaman invoice (hosted page).
// Jumlah selalu diambil server dari Order.total, bukan dari klien.
export function PayNowButton({ orderId, phone }: PayNowButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setError(null);
    setLoading(true);
    try {
      const result = await apiRequest<{ payment: { invoiceUrl: string } }>(
        "/api/payments/create",
        {
          method: "POST",
          body: JSON.stringify({ orderId, phone }),
        },
      );
      window.location.href = result.payment.invoiceUrl;
    } catch (caught) {
      setError(toErrorMessage(caught));
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" onClick={handlePay} disabled={loading} className="w-full">
        {loading ? "Mengalihkan ke pembayaran..." : "Bayar Sekarang"}
      </Button>
      <FormErrorAlert message={error} />
    </div>
  );
}
