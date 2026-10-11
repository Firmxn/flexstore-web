"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { paymentSettingsSchema } from "@/lib/platform/validation";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";
import { FormErrorAlert } from "@/components/ui/form-error-alert";

// SITE-02 (PH-08): konfigurasi payment gateway Xendit. Kunci API tidak bisa
// diubah dari sini (tetap di env); panel di bawah hanya menampilkan statusnya.

export type PaymentSettingsFormValues = {
  paymentEnabled: boolean;
  paymentMode: "SANDBOX" | "PRODUCTION";
  invoiceDurationSeconds: number;
};

export type PaymentSecretStatus = {
  xenditSecretKey: boolean;
  xenditWebhookToken: boolean;
};

function SecretBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
      {label}
      <Badge variant={ok ? "success" : "destructive"}>
        {ok ? "Ada" : "Belum"}
      </Badge>
    </li>
  );
}

export function PaymentSettingsForm({
  initial,
  secrets,
}: {
  initial: PaymentSettingsFormValues;
  secrets: PaymentSecretStatus;
}) {
  const router = useRouter();
  const [paymentEnabled, setPaymentEnabled] = useState(initial.paymentEnabled);
  const [paymentMode, setPaymentMode] = useState<"SANDBOX" | "PRODUCTION">(
    initial.paymentMode,
  );
  const [duration, setDuration] = useState(
    String(initial.invoiceDurationSeconds),
  );
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);

    const parsed = paymentSettingsSchema.safeParse({
      paymentEnabled,
      paymentMode,
      invoiceDurationSeconds: duration,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Data tidak valid");
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest("/api/site-admin/payment-settings", {
        method: "PATCH",
        body: JSON.stringify(parsed.data),
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FormErrorAlert message={error} />
      {saved ? <Alert variant="success">Konfigurasi tersimpan.</Alert> : null}

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
        <h2 className="font-semibold">Pembayaran</h2>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-input"
            checked={paymentEnabled}
            onChange={(event) => {
              setPaymentEnabled(event.target.checked);
              setSaved(false);
            }}
          />
          Aktifkan pembayaran online
        </label>
        <p className="text-sm text-muted-foreground">
          Saat dimatikan, invoice baru ditolak. Invoice yang sudah terbit tetap
          bisa dibuka.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="payment-mode">Mode</Label>
            <Select
              value={paymentMode}
              onValueChange={(value) => {
                setPaymentMode(value as "SANDBOX" | "PRODUCTION");
                setSaved(false);
              }}
            >
              <SelectTrigger id="payment-mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SANDBOX">Sandbox (uji coba)</SelectItem>
                <SelectItem value="PRODUCTION">Production (produksi)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Label/jejak audit. Sandbox vs produksi tetap ditentukan oleh kunci
              di env.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="payment-duration">Masa bayar invoice (detik)</Label>
            <Input
              id="payment-duration"
              type="number"
              min={60}
              max={86400}
              value={duration}
              onChange={(event) => {
                setDuration(event.target.value);
                setSaved(false);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Sama dengan masa reservasi stok. 60-86400 detik.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-xl border border-border bg-background p-6">
        <h2 className="font-semibold">Kunci Rahasia (env)</h2>
        <p className="text-sm text-muted-foreground">
          Diisi di <code>.env.local</code>, bukan di halaman ini.
        </p>
        <ul className="flex flex-wrap gap-2">
          <SecretBadge ok={secrets.xenditSecretKey} label="XENDIT_SECRET_KEY" />
          <SecretBadge
            ok={secrets.xenditWebhookToken}
            label="XENDIT_WEBHOOK_TOKEN"
          />
        </ul>
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Menyimpan..." : "Simpan Konfigurasi"}
        </Button>
      </div>
    </form>
  );
}
