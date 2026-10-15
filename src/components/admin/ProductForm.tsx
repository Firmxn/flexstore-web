"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { VariantImagePicker } from "@/components/admin/VariantImagePicker";
import { VideoHeroUploader } from "@/components/admin/VideoHeroUploader";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";
import {
  MAX_LOOKBOOK_IMAGES,
  MAX_STORY_TEXT,
  PRODUCT_STATUSES,
  productSchema,
} from "@/lib/products/validation";
import { PRODUCT_STATUS_LABELS } from "@/lib/utils/format";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";
import { slugify } from "@/lib/utils/slug";
import { FormErrorAlert } from "@/components/ui/form-error-alert";

export type VariantRow = {
  sku: string;
  name: string;
  price: string;
  stock: string;
  weightGram: string;
  imageUrl: string;
};

export type ProductFormValues = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  brandId: string;
  status: string;
  images: string[];
  sizeChartUrl: string;
  videoHeroUrl: string;
  videoHeroAutoplay: boolean;
  heroImageUrl: string;
  storyText: string;
  storyImageUrl: string;
  lookbookUrls: string[];
  variants: VariantRow[];
};

type Option = { id: string; name: string };

const EMPTY_VARIANT: VariantRow = {
  sku: "",
  name: "",
  price: "",
  stock: "",
  weightGram: "1000",
  imageUrl: "",
};

export function ProductForm({
  categories,
  brands,
  initial,
}: {
  categories: Option[];
  brands: Option[];
  initial?: ProductFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(
    initial ?? {
      name: "",
      slug: "",
      description: "",
      categoryId: categories[0]?.id ?? "",
      brandId: "",
      status: "DRAFT",
      images: [],
      sizeChartUrl: "",
      videoHeroUrl: "",
      videoHeroAutoplay: true,
      heroImageUrl: "",
      storyText: "",
      storyImageUrl: "",
      lookbookUrls: [],
      variants: [{ ...EMPTY_VARIANT }],
    },
  );
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  // Jenis banner hero dipilih admin (gambar atau video); disimpan sebagai state
  // terpisah supaya pilihan tetap terlihat sebelum berkas diunggah.
  const [heroType, setHeroType] = useState<"none" | "image" | "video">(
    initial?.videoHeroUrl ? "video" : initial?.heroImageUrl ? "image" : "none",
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isEdit = Boolean(initial?.id);

  function setField<K extends keyof ProductFormValues>(
    field: K,
    value: ProductFormValues[K],
  ) {
    setValues((previous) => ({ ...previous, [field]: value }));
  }

  function handleNameChange(name: string) {
    setValues((previous) => ({
      ...previous,
      name,
      slug: slugTouched ? previous.slug : slugify(name),
    }));
  }

  function updateVariant(index: number, patch: Partial<VariantRow>) {
    setValues((previous) => ({
      ...previous,
      variants: previous.variants.map((variant, position) =>
        position === index ? { ...variant, ...patch } : variant,
      ),
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = productSchema.safeParse({
      name: values.name,
      slug: values.slug,
      description: values.description,
      categoryId: values.categoryId,
      brandId: values.brandId,
      status: values.status,
      images: values.images.map((url, index) => ({ url, sortOrder: index })),
      sizeChartUrl: values.sizeChartUrl,
      videoHeroUrl: values.videoHeroUrl,
      videoHeroAutoplay: values.videoHeroAutoplay,
      heroImageUrl: values.heroImageUrl,
      storyText: values.storyText,
      storyImageUrl: values.storyImageUrl,
      lookbookUrls: values.lookbookUrls,
      variants: values.variants.map((variant) => ({
        sku: variant.sku,
        name: variant.name,
        price: Number(variant.price),
        stock: Number(variant.stock),
        weightGram: Number(variant.weightGram),
        // URL kosong dikirim sebagai null supaya lolos validasi opsional.
        imageUrl: variant.imageUrl.trim() || null,
      })),
    });

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      setError(issue?.message ?? "Data tidak valid");
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest(
        isEdit
          ? `/api/admin/products/${initial?.id}`
          : "/api/admin/products",
        {
          method: isEdit ? "PATCH" : "POST",
          body: JSON.stringify(parsed.data),
        },
      );

      router.push("/admin/products");
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

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
        <h2 className="font-semibold">Informasi Produk</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="product-name">Nama Produk</Label>
            <Input
              id="product-name"
              required
              maxLength={200}
              value={values.name}
              onChange={(event) => handleNameChange(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="product-slug">Slug</Label>
            <Input
              id="product-slug"
              required
              maxLength={200}
              value={values.slug}
              onChange={(event) => {
                setSlugTouched(true);
                setField("slug", event.target.value);
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="product-description">Deskripsi</Label>
          <Textarea
            id="product-description"
            rows={4}
            maxLength={5000}
            value={values.description}
            onChange={(event) => setField("description", event.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="product-category">Kategori</Label>
            <Select
              value={values.categoryId || "__none__"}
              onValueChange={(value) =>
                setField("categoryId", value === "__none__" ? "" : value)
              }
            >
              <SelectTrigger id="product-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Pilih kategori</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="product-brand">Brand (opsional)</Label>
            <Select
              value={values.brandId || "__none__"}
              onValueChange={(value) =>
                setField("brandId", value === "__none__" ? "" : value)
              }
            >
              <SelectTrigger id="product-brand">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Tanpa brand</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="product-status">Status</Label>
            <Select
              value={values.status}
              onValueChange={(value) => setField("status", value)}
            >
              <SelectTrigger id="product-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {PRODUCT_STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Gambar Produk dan Bagan Ukuran berdampingan: satu baris dua kolom
          (keputusan pengguna 2026-10-15); menumpuk kembali di layar sempit. */}
      <div className="grid gap-4 md:grid-cols-2">
        <section className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
          <h2 className="font-semibold">Gambar Produk</h2>
          <ImageUploader
            layout="gallery"
            productName={values.name || "Produk"}
            urls={values.images}
            setUrls={(action) => {
              setValues((previous) => ({
                ...previous,
                images:
                  typeof action === "function" ? action(previous.images) : action,
              }));
            }}
          />
        </section>

        <section className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold">Bagan Ukuran</h2>
            <p className="text-sm text-muted-foreground">
              Opsional. Satu gambar bagan ukuran yang tampil di halaman produk.
            </p>
          </div>
          <ImageUploader
            max={1}
            layout="single"
            fit="contain"
            productName={values.name || "Produk"}
            // Mengikuti dialog "Bagan Ukuran" storefront: kotak 3:4 (rasio
            // deklarasi tampilan storefront) dengan object-contain, jadi gambar
            // tampil tanpa krop persis seperti di halaman produk.
            mediaClassName="aspect-[3/4] w-full max-w-sm mx-auto"
            urls={values.sizeChartUrl ? [values.sizeChartUrl] : []}
            setUrls={(action) => {
              setValues((previous) => {
                const current = previous.sizeChartUrl
                  ? [previous.sizeChartUrl]
                  : [];
                const next =
                  typeof action === "function" ? action(current) : action;
                return { ...previous, sizeChartUrl: next[0] ?? "" };
              });
            }}
          />
        </section>
      </div>

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold">Seksi Editorial (opsional)</h2>
          <p className="text-sm text-muted-foreground">
            Semuanya opsional — isi hanya yang ingin ditampilkan di halaman
            produk. Seksi yang kosong tidak dirender sama sekali.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="product-hero-type">Banner Hero (opsional)</Label>
            <p className="text-sm text-muted-foreground">
              Banner panorama full-width di bawah grid produk. Pilih salah satu
              sumber: gambar atau video.
            </p>
            <Select
              value={heroType}
              onValueChange={(value) => {
                const next = value as "none" | "image" | "video";
                setHeroType(next);
                // Hanya satu sumber yang disimpan: pilihan baru mengosongkan
                // sumber lain agar tidak ada dua banner bersaing.
                if (next !== "image") setField("heroImageUrl", "");
                if (next !== "video") setField("videoHeroUrl", "");
              }}
            >
              <SelectTrigger id="product-hero-type" className="sm:max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tanpa banner</SelectItem>
                <SelectItem value="image">Gambar</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>

            {heroType === "image" ? (
              <div className="flex flex-col gap-2">
                <ImageUploader
                  max={1}
                  layout="single"
                  fit="cover"
                  productName={values.name || "Produk"}
                  // Rasio banner storefront (panorama di layar lebar).
                  mediaClassName="aspect-video w-full sm:aspect-[4/1]"
                  urls={values.heroImageUrl ? [values.heroImageUrl] : []}
                  setUrls={(action) => {
                    setValues((previous) => {
                      const current = previous.heroImageUrl
                        ? [previous.heroImageUrl]
                        : [];
                      const next =
                        typeof action === "function"
                          ? action(current)
                          : action;
                      return { ...previous, heroImageUrl: next[0] ?? "" };
                    });
                  }}
                />
              </div>
            ) : null}

            {heroType === "video" ? (
              <VideoHeroUploader
                url={values.videoHeroUrl}
                autoplay={values.videoHeroAutoplay}
                onUrlChange={(url) => setField("videoHeroUrl", url)}
                onAutoplayChange={(autoplay) =>
                  setField("videoHeroAutoplay", autoplay)
                }
              />
            ) : null}
          </div>

          {/* Susunan mengikuti seksi "Cerita produk" storefront: gambar 16:9 di
              kiri, narasi di kanan. */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Gambar Narasi (opsional)</Label>
              <p className="text-sm text-muted-foreground">
                Satu gambar editorial, tampil di kiri narasi (rasio 16:9 seperti
                storefront).
              </p>
              <ImageUploader
                max={1}
                layout="single"
                fit="cover"
                productName={values.name || "Produk"}
                mediaClassName="aspect-video w-full"
                urls={values.storyImageUrl ? [values.storyImageUrl] : []}
                setUrls={(action) => {
                  setValues((previous) => {
                    const current = previous.storyImageUrl
                      ? [previous.storyImageUrl]
                      : [];
                    const next =
                      typeof action === "function" ? action(current) : action;
                    return { ...previous, storyImageUrl: next[0] ?? "" };
                  });
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="product-story-text">
                Narasi Produk (opsional)
              </Label>
              <Textarea
                id="product-story-text"
                rows={5}
                maxLength={MAX_STORY_TEXT}
                placeholder="Kosongkan untuk memakai deskripsi produk sebagai narasi."
                value={values.storyText}
                onChange={(event) => setField("storyText", event.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Lookbook (opsional)</Label>
            <p className="text-sm text-muted-foreground">
              Maksimal {MAX_LOOKBOOK_IMAGES} foto, tampil di grid paling bawah.
            </p>
            <ImageUploader
              layout="lookbook"
              productName={values.name || "Produk"}
              max={MAX_LOOKBOOK_IMAGES}
              urls={values.lookbookUrls}
              setUrls={(action) => {
                setValues((previous) => ({
                  ...previous,
                  lookbookUrls:
                    typeof action === "function"
                      ? action(previous.lookbookUrls)
                      : action,
                }));
              }}
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Varian</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setValues((previous) => ({
                ...previous,
                variants: [...previous.variants, { ...EMPTY_VARIANT }],
              }))
            }
          >
            Tambah Varian
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          {values.variants.map((variant, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] sm:items-end"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <Label htmlFor={`variant-sku-${index}`}>SKU</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-muted-foreground hover:text-foreground"
                        aria-label="Ketentuan penulisan SKU"
                      >
                        <Info className="h-3.5 w-3.5" aria-hidden />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-64 text-xs">
                      <p className="font-semibold">Ketentuan SKU</p>
                      <ul className="mt-1 list-disc space-y-1 pl-4 text-muted-foreground">
                        <li>
                          Huruf, angka, titik, minus, garis bawah; maksimal 64
                          karakter.
                        </li>
                        <li>Wajib unik antar semua produk.</li>
                        <li>
                          Format disarankan: inisial produk - kode produk -
                          varian, contoh KP-30S-M (Kaos Polos 30s, ukuran M).
                        </li>
                      </ul>
                    </PopoverContent>
                  </Popover>
                </div>
                <Input
                  id={`variant-sku-${index}`}
                  required
                  maxLength={64}
                  value={variant.sku}
                  onChange={(event) =>
                    updateVariant(index, { sku: event.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor={`variant-name-${index}`}>Nama Varian</Label>
                <Input
                  id={`variant-name-${index}`}
                  required
                  maxLength={200}
                  value={variant.name}
                  onChange={(event) =>
                    updateVariant(index, { name: event.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor={`variant-price-${index}`}>Harga (Rp)</Label>
                <Input
                  id={`variant-price-${index}`}
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={variant.price}
                  onChange={(event) =>
                    updateVariant(index, { price: event.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor={`variant-stock-${index}`}>Stok</Label>
                <Input
                  id={`variant-stock-${index}`}
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={variant.stock}
                  onChange={(event) =>
                    updateVariant(index, { stock: event.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor={`variant-weight-${index}`}>Berat (gram)</Label>
                <Input
                  id={`variant-weight-${index}`}
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={variant.weightGram}
                  onChange={(event) =>
                    updateVariant(index, { weightGram: event.target.value })
                  }
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={values.variants.length <= 1}
                onClick={() =>
                  setValues((previous) => ({
                    ...previous,
                    variants: previous.variants.filter(
                      (_, position) => position !== index,
                    ),
                  }))
                }
              >
                Hapus
              </Button>

              <div className="sm:col-span-6">
                <VariantImagePicker
                  id={`variant-image-${index}`}
                  url={variant.imageUrl}
                  onChange={(url) => updateVariant(index, { imageUrl: url })}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Produk"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
