"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { StoreSettings } from "@/lib/config";
import { storeSettingsSchema } from "@/lib/config";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";
import { FormErrorAlert } from "@/components/ui/form-error-alert";

// CONFIG-01 (PH-06): form pengaturan toko. Data kosong dikirim sebagai undefined
// supaya validator menganggapnya "tidak diisi".

type FormValues = {
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  aboutUs: string;
  returnPolicy: string;
  warrantyPolicy: string;
  pickupEnabled: boolean;
  pickupInfo: string;
  socialInstagram: string;
  socialFacebook: string;
  socialWhatsapp: string;
};

const toForm = (settings: StoreSettings): FormValues => ({
  storeEmail: settings.storeEmail ?? "",
  storePhone: settings.storePhone ?? "",
  storeAddress: settings.storeAddress ?? "",
  aboutUs: settings.aboutUs ?? "",
  returnPolicy: settings.returnPolicy ?? "",
  warrantyPolicy: settings.warrantyPolicy ?? "",
  pickupEnabled: settings.pickupEnabled,
  pickupInfo: settings.pickupInfo ?? "",
  socialInstagram: settings.socialInstagram ?? "",
  socialFacebook: settings.socialFacebook ?? "",
  socialWhatsapp: settings.socialWhatsapp ?? "",
});

const orUndefined = (value: string) =>
  value.trim() === "" ? undefined : value.trim();

export function StoreSettingsForm({ initial }: { initial: StoreSettings }) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(toForm(initial));
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function setField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setSaved(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = storeSettingsSchema.safeParse({
      storeEmail: orUndefined(values.storeEmail),
      storePhone: orUndefined(values.storePhone),
      storeAddress: orUndefined(values.storeAddress),
      aboutUs: orUndefined(values.aboutUs),
      returnPolicy: orUndefined(values.returnPolicy),
      warrantyPolicy: orUndefined(values.warrantyPolicy),
      pickupEnabled: values.pickupEnabled,
      pickupInfo: orUndefined(values.pickupInfo),
      socialInstagram: orUndefined(values.socialInstagram),
      socialFacebook: orUndefined(values.socialFacebook),
      socialWhatsapp: orUndefined(values.socialWhatsapp),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Data tidak valid");
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest("/api/admin/settings", {
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

      {/* CONFIG-01: nama identitas toko = brandName (SITE-05, Site Admin).
          Pengaturan toko hanya menampung kontak operasional, kebijakan, dan
          pickup — tidak ada field "nama toko" untuk menghindari dua nama. */}
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
        <h2 className="font-semibold">Informasi Toko</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="store-email">Email toko</Label>
            <Input
              id="store-email"
              type="email"
              maxLength={200}
              value={values.storeEmail}
              onChange={(event) => setField("storeEmail", event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="store-phone">Nomor telepon</Label>
            <Input
              id="store-phone"
              maxLength={30}
              value={values.storePhone}
              onChange={(event) => setField("storePhone", event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="store-address">Alamat toko</Label>
            <Input
              id="store-address"
              maxLength={300}
              value={values.storeAddress}
              onChange={(event) => setField("storeAddress", event.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
        <h2 className="font-semibold">Informasi Halaman</h2>
        <div className="flex flex-col gap-2">
          <Label htmlFor="store-about">Tentang toko</Label>
          <Textarea
            id="store-about"
            rows={3}
            maxLength={2000}
            value={values.aboutUs}
            onChange={(event) => setField("aboutUs", event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="store-return">Kebijakan pengembalian</Label>
          <Textarea
            id="store-return"
            rows={3}
            maxLength={2000}
            value={values.returnPolicy}
            onChange={(event) => setField("returnPolicy", event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="store-warranty">Kebijakan garansi</Label>
          <Textarea
            id="store-warranty"
            rows={3}
            maxLength={2000}
            value={values.warrantyPolicy}
            onChange={(event) => setField("warrantyPolicy", event.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="store-instagram">Instagram</Label>
            <Input
              id="store-instagram"
              maxLength={200}
              value={values.socialInstagram}
              onChange={(event) => setField("socialInstagram", event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="store-facebook">Facebook</Label>
            <Input
              id="store-facebook"
              maxLength={200}
              value={values.socialFacebook}
              onChange={(event) => setField("socialFacebook", event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="store-whatsapp">WhatsApp</Label>
            <Input
              id="store-whatsapp"
              maxLength={200}
              value={values.socialWhatsapp}
              onChange={(event) => setField("socialWhatsapp", event.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
        <h2 className="font-semibold">Pickup</h2>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-input"
            checked={values.pickupEnabled}
            onChange={(event) => setField("pickupEnabled", event.target.checked)}
          />
          Aktifkan opsi ambil di toko saat checkout
        </label>
        <div className="flex flex-col gap-2">
          <Label htmlFor="store-pickup-info">Informasi pickup</Label>
          <Textarea
            id="store-pickup-info"
            rows={3}
            maxLength={1000}
            placeholder="Contoh: Ambil di Jl. Merdeka 1, Senin-Jumat 09.00-17.00."
            value={values.pickupInfo}
            onChange={(event) => setField("pickupInfo", event.target.value)}
          />
        </div>
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Menyimpan..." : "Simpan Pengaturan"}
        </Button>
      </div>
    </form>
  );
}
