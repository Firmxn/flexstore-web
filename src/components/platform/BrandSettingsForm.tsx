"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PALETTE_FIELDS } from "@/lib/brand/palette";
import { brandSettingsSchema } from "@/lib/brand/validation";
import type { BrandFormValues } from "@/lib/brand/view";
import { useUploadThing } from "@/lib/uploadthing/client";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";
import { AssetPicker } from "./AssetPicker";

// SITE-05 (PH-09): identitas brand per deployment. Empat bagian: Identitas,
// Palet Warna, Banner Homepage, Teks Footer.

const orUndefined = (value: string) =>
  value.trim() === "" ? undefined : value.trim();

export function BrandSettingsForm({ initial }: { initial: BrandFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function setValue<K extends keyof BrandFormValues>(
    key: K,
    value: BrandFormValues[K],
  ) {
    setValues((previous) => ({ ...previous, [key]: value }));
    setSaved(false);
  }

  const logoUpload = useUploadThing("brandAsset", {
    onClientUploadComplete: (files) => {
      const url = files[0]?.serverData.url;
      if (url) setValue("logoUrl", url);
    },
    onUploadError: () => setError("Gagal mengunggah logo, coba lagi"),
  });

  const faviconUpload = useUploadThing("brandAsset", {
    onClientUploadComplete: (files) => {
      const url = files[0]?.serverData.url;
      if (url) setValue("faviconUrl", url);
    },
    onUploadError: () => setError("Gagal mengunggah favicon, coba lagi"),
  });

  const bannerUpload = useUploadThing("bannerImage", {
    onClientUploadComplete: (files) => {
      const url = files[0]?.serverData.url;
      if (url) setValue("bannerImageUrl", url);
    },
    onUploadError: () => setError("Gagal mengunggah gambar banner, coba lagi"),
  });

  function resetPalette() {
    setValues((previous) => {
      const next = { ...previous };
      for (const field of PALETTE_FIELDS) next[field.key] = "";
      return next;
    });
    setSaved(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);

    const payload: Record<string, unknown> = {
      brandName: values.brandName,
      tagline: orUndefined(values.tagline),
      logoUrl: orUndefined(values.logoUrl),
      faviconUrl: orUndefined(values.faviconUrl),
      footerText: orUndefined(values.footerText),
      bannerEnabled: values.bannerEnabled,
      bannerImageUrl: orUndefined(values.bannerImageUrl),
      bannerTitle: orUndefined(values.bannerTitle),
      bannerText: orUndefined(values.bannerText),
      bannerButtonLabel: orUndefined(values.bannerButtonLabel),
      bannerButtonHref: orUndefined(values.bannerButtonHref),
    };
    for (const field of PALETTE_FIELDS) {
      payload[field.key] = orUndefined(values[field.key]);
    }

    const parsed = brandSettingsSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Data tidak valid");
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest("/api/site-admin/brand", {
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
      {error ? <Alert variant="destructive">{error}</Alert> : null}
      {saved ? <Alert variant="success">Identitas brand tersimpan.</Alert> : null}

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
        <div>
          <h2 className="font-semibold">Identitas</h2>
          <p className="text-sm text-muted-foreground">
            Nama brand dipakai di header, footer, judul halaman, kop invoice, dan
            email. Kosongkan logo untuk memakai teks nama.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="brand-name">Nama brand</Label>
          <Input
            id="brand-name"
            maxLength={50}
            value={values.brandName}
            onChange={(event) => setValue("brandName", event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="brand-tagline">Tagline</Label>
          <Input
            id="brand-tagline"
            maxLength={160}
            placeholder="Kosongkan untuk memakai deskripsi bawaan"
            value={values.tagline}
            onChange={(event) => setValue("tagline", event.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AssetPicker
            id="brand-logo"
            label="Logo"
            hint="PNG/JPG/SVG, maksimal 2MB. Tampil di header storefront."
            url={values.logoUrl}
            uploading={logoUpload.isUploading}
            onUpload={(files) => void logoUpload.startUpload(files)}
            onClear={() => setValue("logoUrl", "")}
          />
          <AssetPicker
            id="brand-favicon"
            label="Favicon"
            hint="Ikon tab browser, maksimal 2MB."
            url={values.faviconUrl}
            previewClassName="h-8 w-8 rounded border border-border object-contain"
            uploading={faviconUpload.isUploading}
            onUpload={(files) => void faviconUpload.startUpload(files)}
            onClear={() => setValue("faviconUrl", "")}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold">Palet Warna</h2>
            <p className="text-sm text-muted-foreground">
              Kode warna heksadesimal (#RRGGBB) atau pilih lewat pemilih warna.
              Slot kosong memakai warna bawaan. Berlaku di seluruh aplikasi.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={resetPalette}>
            Atur Ulang Palet
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PALETTE_FIELDS.map((field) => (
            <div key={field.key} className="flex flex-col gap-1">
              <Label htmlFor={`color-${field.key}`}>{field.label}</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  aria-label={`Pemilih warna ${field.label}`}
                  className="h-9 w-12 cursor-pointer rounded border border-border bg-background"
                  value={values[field.key] || "#000000"}
                  onChange={(event) =>
                    setValue(field.key, event.target.value.toUpperCase())
                  }
                />
                <Input
                  id={`color-${field.key}`}
                  placeholder="#RRGGBB"
                  maxLength={7}
                  value={values[field.key]}
                  onChange={(event) => setValue(field.key, event.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
        <div>
          <h2 className="font-semibold">Banner Homepage</h2>
          <p className="text-sm text-muted-foreground">
            Saat aktif, bagian atas homepage memakai gambar dan teks ini. Saat
            mati, homepage memakai hero teks bawaan.
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-input"
            checked={values.bannerEnabled}
            onChange={(event) =>
              setValue("bannerEnabled", event.target.checked)
            }
          />
          Aktifkan banner
        </label>

        <AssetPicker
          id="brand-banner-image"
          label="Gambar banner"
          hint="Maksimal 4MB. Disarankan lanskap (mis. 1600x600)."
          url={values.bannerImageUrl}
          previewClassName="h-28 w-full max-w-md rounded border border-border object-cover"
          uploading={bannerUpload.isUploading}
          onUpload={(files) => void bannerUpload.startUpload(files)}
          onClear={() => setValue("bannerImageUrl", "")}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="banner-title">Judul</Label>
            <Input
              id="banner-title"
              maxLength={80}
              placeholder={`Kosongkan untuk "Selamat datang di ${values.brandName}"`}
              value={values.bannerTitle}
              onChange={(event) => setValue("bannerTitle", event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="banner-text">Teks</Label>
            <Input
              id="banner-text"
              maxLength={200}
              value={values.bannerText}
              onChange={(event) => setValue("bannerText", event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="banner-button-label">Label tombol</Label>
            <Input
              id="banner-button-label"
              maxLength={40}
              value={values.bannerButtonLabel}
              onChange={(event) =>
                setValue("bannerButtonLabel", event.target.value)
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="banner-button-href">Tautan tombol</Label>
            <Input
              id="banner-button-href"
              placeholder="/products"
              value={values.bannerButtonHref}
              onChange={(event) =>
                setValue("bannerButtonHref", event.target.value)
              }
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
        <div>
          <h2 className="font-semibold">Teks Footer</h2>
          <p className="text-sm text-muted-foreground">
            Paragraf tambahan di bagian bawah halaman. Kosongkan untuk memakai
            footer bawaan.
          </p>
        </div>
        <Textarea
          id="footer-text"
          rows={3}
          maxLength={300}
          value={values.footerText}
          onChange={(event) => setValue("footerText", event.target.value)}
        />
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Menyimpan..." : "Simpan Identitas Brand"}
        </Button>
      </div>
    </form>
  );
}
