"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { VariantImagePicker } from "@/components/admin/VariantImagePicker";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
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
      variants: [{ ...EMPTY_VARIANT }],
    },
  );
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
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

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
        <h2 className="font-semibold">Gambar Produk</h2>
        <ImageUploader urls={values.images} setUrls={(action) => {
          setValues((previous) => ({
            ...previous,
            images:
              typeof action === "function" ? action(previous.images) : action,
          }));
        }} />
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
                <Label htmlFor={`variant-sku-${index}`}>SKU</Label>
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
