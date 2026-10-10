"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  VOUCHER_TYPE_LABELS,
  VOUCHER_TYPES,
  voucherSchema,
} from "@/lib/vouchers/validation";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";

export type VoucherOption = {
  id: string;
  code: string;
  isActive: boolean;
};

export type VoucherFormValues = {
  id?: string;
  code: string;
  type: string;
  discountPercentage: string;
  discountAmount: string;
  maxDiscount: string;
  minTransaction: string;
  usageLimit: string;
  usageLimitPerPhone: string;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  compatibleVoucherIds: string[];
};

export const EMPTY_VOUCHER: VoucherFormValues = {
  code: "",
  type: "NOMINAL",
  discountPercentage: "",
  discountAmount: "",
  maxDiscount: "",
  minTransaction: "",
  usageLimit: "",
  usageLimitPerPhone: "",
  validFrom: "",
  validUntil: "",
  isActive: true,
  compatibleVoucherIds: [],
};

// Batas tanggal: mulai di awal hari, berakhir di akhir hari supaya tanggal
// akhir tetap inklusif (voucher masih sah sampai 23:59 tanggal itu).
const startOfDay = (value: string) => (value ? `${value}T00:00:00.000Z` : undefined);
const endOfDay = (value: string) => (value ? `${value}T23:59:59.999Z` : undefined);

const toNumber = (value: string) => (value.trim() === "" ? undefined : Number(value));

export function VoucherForm({
  options,
  initial,
}: {
  options: VoucherOption[];
  initial?: VoucherFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<VoucherFormValues>(initial ?? EMPTY_VOUCHER);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isEdit = Boolean(initial?.id);
  const isPercentage = values.type === "PERCENTAGE";

  function setField<K extends keyof VoucherFormValues>(
    field: K,
    value: VoucherFormValues[K],
  ) {
    setValues((previous) => ({ ...previous, [field]: value }));
  }

  function toggleCompatibility(id: string) {
    setValues((previous) => ({
      ...previous,
      compatibleVoucherIds: previous.compatibleVoucherIds.includes(id)
        ? previous.compatibleVoucherIds.filter((item) => item !== id)
        : [...previous.compatibleVoucherIds, id],
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = voucherSchema.safeParse({
      code: values.code,
      type: values.type,
      discountPercentage: isPercentage
        ? toNumber(values.discountPercentage)
        : undefined,
      discountAmount: isPercentage ? undefined : toNumber(values.discountAmount),
      maxDiscount: isPercentage ? toNumber(values.maxDiscount) : undefined,
      minTransaction: toNumber(values.minTransaction) ?? 0,
      usageLimit: toNumber(values.usageLimit),
      usageLimitPerPhone: toNumber(values.usageLimitPerPhone),
      validFrom: startOfDay(values.validFrom),
      validUntil: endOfDay(values.validUntil),
      isActive: values.isActive,
      compatibleVoucherIds: values.compatibleVoucherIds,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Data tidak valid");
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest(
        isEdit ? `/api/admin/vouchers/${initial?.id}` : "/api/admin/vouchers",
        {
          method: isEdit ? "PATCH" : "POST",
          body: JSON.stringify(parsed.data),
        },
      );
      router.push("/admin/vouchers");
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

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
        <h2 className="font-semibold">Voucher</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="voucher-code">Kode</Label>
            <Input
              id="voucher-code"
              required
              maxLength={30}
              placeholder="DISKON10"
              value={values.code}
              onChange={(event) =>
                setField("code", event.target.value.toUpperCase())
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="voucher-type">Jenis</Label>
            <Select
              id="voucher-type"
              value={values.type}
              onChange={(event) => setField("type", event.target.value)}
            >
              {VOUCHER_TYPES.map((type) => (
                <option key={type} value={type}>
                  {VOUCHER_TYPE_LABELS[type]}
                </option>
              ))}
            </Select>
          </div>

          {isPercentage ? (
            <>
              <div className="flex flex-col gap-2">
                <Label htmlFor="voucher-percentage">Persentase (%)</Label>
                <Input
                  id="voucher-percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={values.discountPercentage}
                  onChange={(event) =>
                    setField("discountPercentage", event.target.value)
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="voucher-max">Maksimal potongan (Rp, opsional)</Label>
                <Input
                  id="voucher-max"
                  type="number"
                  min="0"
                  step="1"
                  value={values.maxDiscount}
                  onChange={(event) => setField("maxDiscount", event.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Label htmlFor="voucher-amount">
                {values.type === "SHIPPING" ? "Potongan ongkir (Rp)" : "Nominal (Rp)"}
              </Label>
              <Input
                id="voucher-amount"
                type="number"
                min="0"
                step="1"
                value={values.discountAmount}
                onChange={(event) => setField("discountAmount", event.target.value)}
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="voucher-min">Minimal transaksi (Rp, opsional)</Label>
            <Input
              id="voucher-min"
              type="number"
              min="0"
              step="1"
              value={values.minTransaction}
              onChange={(event) => setField("minTransaction", event.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
        <h2 className="font-semibold">Batas Pemakaian</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="voucher-usage-limit">Kuota total (opsional)</Label>
            <Input
              id="voucher-usage-limit"
              type="number"
              min="0"
              step="1"
              placeholder="Tanpa batas"
              value={values.usageLimit}
              onChange={(event) => setField("usageLimit", event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="voucher-usage-phone">Batas per nomor HP (opsional)</Label>
            <Input
              id="voucher-usage-phone"
              type="number"
              min="0"
              step="1"
              placeholder="Tanpa batas"
              value={values.usageLimitPerPhone}
              onChange={(event) =>
                setField("usageLimitPerPhone", event.target.value)
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="voucher-valid-from">Berlaku mulai</Label>
            <Input
              id="voucher-valid-from"
              type="date"
              required
              value={values.validFrom}
              onChange={(event) => setField("validFrom", event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="voucher-valid-until">Berlaku sampai</Label>
            <Input
              id="voucher-valid-until"
              type="date"
              required
              value={values.validUntil}
              onChange={(event) => setField("validUntil", event.target.value)}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-input"
            checked={values.isActive}
            onChange={(event) => setField("isActive", event.target.checked)}
          />
          Voucher aktif
        </label>
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold">Kompatibilitas Stacking</h2>
          <p className="text-sm text-muted-foreground">
            Voucher hanya bisa digabung dengan voucher yang dicentang di sini.
            Pasangan yang tidak dicentang tidak boleh digabung.
          </p>
        </div>

        {options.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada voucher lain.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {options.map((option) => (
              <label key={option.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input"
                  checked={values.compatibleVoucherIds.includes(option.id)}
                  onChange={() => toggleCompatibility(option.id)}
                />
                <span className="font-medium">{option.code}</span>
                {!option.isActive ? (
                  <span className="text-xs text-muted-foreground">(nonaktif)</span>
                ) : null}
              </label>
            ))}
          </div>
        )}
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Voucher"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/vouchers")}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
