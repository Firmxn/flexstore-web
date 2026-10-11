"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { platformSettingsSchema } from "@/lib/platform/validation";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";
import { FormErrorAlert } from "@/components/ui/form-error-alert";

// SITE-01 (PH-08): mode pemeliharaan + status pendaftaran publik.

export type PlatformSettingsFormValues = {
  maintenanceMode: boolean;
  maintenanceMessage: string | null;
  registrationEnabled: boolean;
};

const orUndefined = (value: string) =>
  value.trim() === "" ? undefined : value.trim();

export function PlatformSettingsForm({
  initial,
}: {
  initial: PlatformSettingsFormValues;
}) {
  const router = useRouter();
  const [maintenanceMode, setMaintenanceMode] = useState(
    initial.maintenanceMode,
  );
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    initial.maintenanceMessage ?? "",
  );
  const [registrationEnabled, setRegistrationEnabled] = useState(
    initial.registrationEnabled,
  );
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);

    const parsed = platformSettingsSchema.safeParse({
      maintenanceMode,
      maintenanceMessage: orUndefined(maintenanceMessage),
      registrationEnabled,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Data tidak valid");
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest("/api/site-admin/platform-settings", {
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
      {saved ? <Alert variant="success">Pengaturan tersimpan.</Alert> : null}

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
        <h2 className="font-semibold">Mode Pemeliharaan</h2>
        <p className="text-sm text-muted-foreground">
          Saat aktif, storefront menampilkan banner dan pembuatan pesanan baru
          ditolak. Keranjang, lacak pesanan, dan invoice tetap bisa diakses.
        </p>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-input"
            checked={maintenanceMode}
            onChange={(event) => {
              setMaintenanceMode(event.target.checked);
              setSaved(false);
            }}
          />
          Aktifkan mode pemeliharaan
        </label>
        <div className="flex flex-col gap-2">
          <Label htmlFor="maintenance-message">Pesan pemeliharaan</Label>
          <Textarea
            id="maintenance-message"
            rows={3}
            maxLength={300}
            placeholder="Contoh: Pemeliharaan terjadwal pukul 22.00-23.00 WIB."
            value={maintenanceMessage}
            onChange={(event) => {
              setMaintenanceMessage(event.target.value);
              setSaved(false);
            }}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
        <h2 className="font-semibold">Pendaftaran Publik</h2>
        <p className="text-sm text-muted-foreground">
          Saat ditutup, halaman dan API pendaftaran customer menolak akun baru.
        </p>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-input"
            checked={registrationEnabled}
            onChange={(event) => {
              setRegistrationEnabled(event.target.checked);
              setSaved(false);
            }}
          />
          Izinkan pendaftaran customer baru
        </label>
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Menyimpan..." : "Simpan Pengaturan"}
        </Button>
      </div>
    </form>
  );
}
