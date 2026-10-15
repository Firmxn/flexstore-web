"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slugSchema } from "@/lib/categories/validation";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";
import { slugify } from "@/lib/utils/slug";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormErrorAlert } from "@/components/ui/form-error-alert";

export type TaxonomyItem = {
  id: string;
  name: string;
  slug: string;
  productCount: number;
};

type TaxonomyManagerProps = {
  resource: "categories" | "brands";
  singularLabel: string;
  initialItems: TaxonomyItem[];
};

// Dipakai bersama oleh PROD-04 (Kategori) dan PROD-05 (Brand) karena
// keduanya punya bentuk data dan endpoint yang sama.
export function TaxonomyManager({
  resource,
  singularLabel,
  initialItems,
}: TaxonomyManagerProps) {
  const [items, setItems] = useState(initialItems);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Item yang menunggu konfirmasi hapus (dialog aplikasi, docs/03 bagian 1B).
  const [pendingDelete, setPendingDelete] = useState<TaxonomyItem | null>(null);

  function validate(nameValue: string, slugValue: string): string | null {
    if (nameValue.trim().length === 0) return "Nama wajib diisi";
    const parsed = slugSchema.safeParse(slugValue);
    return parsed.success ? null : (parsed.error.issues[0]?.message ?? "Slug tidak valid");
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const message = validate(name, slug);
    if (message) {
      setError(message);
      return;
    }

    setSubmitting(true);
    try {
      const result = await apiRequest<{
        category?: TaxonomyItem;
        brand?: TaxonomyItem;
      }>(`/api/admin/${resource}`, {
        method: "POST",
        body: JSON.stringify({ name, slug }),
      });

      const created = result.category ?? result.brand;
      if (created) {
        setItems((previous) =>
          [...previous, { ...created, productCount: 0 }].sort((a, b) =>
            a.name.localeCompare(b.name),
          ),
        );
      }
      setName("");
      setSlug("");
      setSlugTouched(false);
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(id: string) {
    setError(null);

    const message = validate(editName, editSlug);
    if (message) {
      setError(message);
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest(`/api/admin/${resource}/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ name: editName, slug: editSlug }),
      });

      setItems((previous) =>
        previous
          .map((item) =>
            item.id === id ? { ...item, name: editName, slug: editSlug } : item,
          )
          .sort((a, b) => a.name.localeCompare(b.name)),
      );
      setEditingId(null);
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;

    try {
      await apiRequest(`/api/admin/${resource}/${pendingDelete.id}`, {
        method: "DELETE",
      });
    } catch (caught) {
      // Galat tampil di dalam dialog konfirmasi.
      throw new Error(toErrorMessage(caught));
    }
    setItems((previous) =>
      previous.filter((entry) => entry.id !== pendingDelete.id),
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <FormErrorAlert message={error} />

      <form
        onSubmit={handleCreate}
        className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6 sm:flex-row sm:items-end"
      >
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor={`new-${resource}-name`}>Nama {singularLabel}</Label>
          <Input
            id={`new-${resource}-name`}
            required
            maxLength={100}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (!slugTouched) setSlug(slugify(event.target.value));
            }}
          />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor={`new-${resource}-slug`}>Slug</Label>
          <Input
            id={`new-${resource}-slug`}
            required
            maxLength={200}
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
          />
        </div>

        <Button type="submit" disabled={submitting}>
          Tambah
        </Button>
      </form>

      <ul className="flex flex-col divide-y divide-border rounded-xl border border-border bg-background">
        {items.length === 0 ? (
          <li className="p-6 text-center text-sm text-muted-foreground">
            Belum ada {singularLabel.toLowerCase()}.
          </li>
        ) : null}

        {items.map((item) => (
          <li key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            {editingId === item.id ? (
              <>
                <Input
                  value={editName}
                  maxLength={100}
                  aria-label={`Nama ${singularLabel}`}
                  onChange={(event) => setEditName(event.target.value)}
                  className="sm:max-w-56"
                />
                <Input
                  value={editSlug}
                  maxLength={200}
                  aria-label={`Slug ${singularLabel}`}
                  onChange={(event) => setEditSlug(event.target.value)}
                  className="sm:max-w-56"
                />
                <div className="flex gap-2 sm:ml-auto">
                  <Button
                    size="sm"
                    disabled={submitting}
                    onClick={() => handleUpdate(item.id)}
                  >
                    Simpan
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingId(null)}
                  >
                    Batal
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-1 flex-col">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.slug} - {item.productCount} produk
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(item.id);
                      setEditName(item.name);
                      setEditSlug(item.slug);
                      setError(null);
                    }}
                  >
                    Ubah
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => setPendingDelete(item)}
                  >
                    Hapus
                  </Button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(next) => {
          if (!next) setPendingDelete(null);
        }}
        title={
          pendingDelete
            ? `Hapus ${singularLabel} "${pendingDelete.name}"?`
            : `Hapus ${singularLabel}?`
        }
        description={`${singularLabel} akan dihapus permanen dari daftar dan tidak bisa dikembalikan.`}
        confirmLabel="Hapus"
        onConfirm={handleDelete}
      />
    </div>
  );
}
