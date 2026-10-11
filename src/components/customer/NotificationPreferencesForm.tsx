"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { NotificationPreferences } from "@/lib/customers/queries";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";
import { FormErrorAlert } from "@/components/ui/form-error-alert";

// CUST-02 (PH-07, PRD 4.8): pilih jenis email yang diterima. Preferensi
// ditegakkan di server saat email dikirim (order-emails).

const OPTIONS: { key: keyof NotificationPreferences; label: string; hint: string }[] = [
  {
    key: "orderConfirmation",
    label: "Konfirmasi pesanan",
    hint: "Email saat pesanan dibuat.",
  },
  {
    key: "paymentConfirmation",
    label: "Konfirmasi pembayaran",
    hint: "Email saat pembayaran berhasil.",
  },
  {
    key: "shippingUpdate",
    label: "Info pengiriman",
    hint: "Email saat pesanan dikirim beserta nomor resi.",
  },
  {
    key: "cancellationUpdate",
    label: "Pembatalan",
    hint: "Email saat pengajuan pembatalan disetujui atau ditolak.",
  },
  {
    key: "refundUpdate",
    label: "Refund",
    hint: "Email saat refund selesai diproses.",
  },
];

export function NotificationPreferencesForm({
  preferences,
}: {
  preferences: NotificationPreferences;
}) {
  const router = useRouter();
  const [values, setValues] = useState(preferences);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function toggle(key: keyof NotificationPreferences, checked: boolean) {
    setSaved(false);
    setValues((current) => ({ ...current, [key]: checked }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);
    setSubmitting(true);
    try {
      await apiRequest("/api/customer/notification-preferences", {
        method: "PATCH",
        body: JSON.stringify(values),
      });
      setSaved(true);
      router.refresh();
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormErrorAlert message={error} />
      {saved ? <Alert>Preferensi disimpan.</Alert> : null}

      <ul className="flex flex-col gap-3">
        {OPTIONS.map((option) => (
          <li key={option.key} className="flex items-start gap-3">
            <input
              id={`pref-${option.key}`}
              type="checkbox"
              className="mt-1 h-4 w-4"
              checked={values[option.key]}
              onChange={(event) => toggle(option.key, event.target.checked)}
            />
            <label htmlFor={`pref-${option.key}`} className="flex flex-col">
              <span className="text-sm font-medium">{option.label}</span>
              <span className="text-xs text-muted-foreground">{option.hint}</span>
            </label>
          </li>
        ))}
      </ul>

      <Button type="submit" disabled={submitting} className="w-fit">
        {submitting ? "Menyimpan..." : "Simpan Preferensi"}
      </Button>
    </form>
  );
}
