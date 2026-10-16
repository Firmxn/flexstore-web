"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { shippingSettingsSchema } from "@/lib/platform/validation";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";
import { FormErrorAlert } from "@/components/ui/form-error-alert";

// SITE-03 (PH-08): konfigurasi shipping provider RajaOngkir. Kunci API tetap di
// env; panel di bawah hanya menampilkan statusnya.

export type ShippingSettingsFormValues = {
  shippingEnabled: boolean;
  shippingOriginDistrictId: string | null;
  shippingCouriers: string;
  shippingWeightPerItemGram: number;
  shippingFlatRateIdr: number;
};

const orUndefined = (value: string) =>
  value.trim() === "" ? undefined : value.trim();

export function ShippingSettingsForm({
  initial,
  rajaongkirConfigured,
}: {
  initial: ShippingSettingsFormValues;
  rajaongkirConfigured: boolean;
}) {
  const router = useRouter();
  const [shippingEnabled, setShippingEnabled] = useState(
    initial.shippingEnabled,
  );
  const [originDistrictId, setOriginDistrictId] = useState(
    initial.shippingOriginDistrictId ?? "",
  );
  const [couriers, setCouriers] = useState(initial.shippingCouriers);
  const [weight, setWeight] = useState(String(initial.shippingWeightPerItemGram));
  const [flatRate, setFlatRate] = useState(String(initial.shippingFlatRateIdr));
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);

    const parsed = shippingSettingsSchema.safeParse({
      shippingEnabled,
      originDistrictId: orUndefined(originDistrictId),
      couriers,
      weightPerItemGram: weight,
      flatRateIdr: flatRate,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Data tidak valid");
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest("/api/site-admin/shipping-settings", {
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
        <h2 className="font-semibold">Perhitungan Ongkir</h2>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-input"
            checked={shippingEnabled}
            onChange={(event) => {
              setShippingEnabled(event.target.checked);
              setSaved(false);
            }}
          />
          Aktifkan perhitungan ongkir dari RajaOngkir
        </label>
        <p className="text-sm text-muted-foreground">
          Saat dimatikan (atau kunci belum diisi), semua pengiriman memakai tarif
          flat di bawah.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="shipping-origin">ID asal ongkir (kecamatan)</Label>
            <Input
              id="shipping-origin"
              maxLength={64}
              placeholder="Kosongkan untuk memakai nilai env"
              value={originDistrictId}
              onChange={(event) => {
                setOriginDistrictId(event.target.value);
                setSaved(false);
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="shipping-couriers">Daftar kurir</Label>
            <Input
              id="shipping-couriers"
              required
              maxLength={200}
              placeholder="jne:sicepat:jnt"
              value={couriers}
              onChange={(event) => {
                setCouriers(event.target.value);
                setSaved(false);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Dipisah titik dua, contoh: jne:sicepat:jnt
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="shipping-weight">Berat per item (gram)</Label>
            <Input
              id="shipping-weight"
              type="number"
              min={1}
              max={50000}
              value={weight}
              onChange={(event) => {
                setWeight(event.target.value);
                setSaved(false);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Dipakai hanya untuk varian yang beratnya belum diisi.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="shipping-flat">Tarif flat (IDR)</Label>
            <Input
              id="shipping-flat"
              type="number"
              min={0}
              max={1000000}
              value={flatRate}
              onChange={(event) => {
                setFlatRate(event.target.value);
                setSaved(false);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Dipakai saat ongkir dimatikan atau provider gagal.
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
          <li className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
            RAJAONGKIR_API_KEY
            <Badge variant={rajaongkirConfigured ? "success" : "destructive"}>
              {rajaongkirConfigured ? "Ada" : "Belum"}
            </Badge>
          </li>
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
