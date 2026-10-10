"use client";

import { useEffect, useState } from "react";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";
import { formatRupiah } from "@/lib/utils/format";
import type { ShippingOption } from "./types";

const optionKey = (option: ShippingOption) => `${option.code}:${option.service}`;
const VISIBLE_COUNT = 3;

type CourierPickerProps = {
  variantIds: string[];
  destinationId?: string;
  configured: boolean;
  onSelect: (option: ShippingOption | null) => void;
};

// Pemilih kurir. Tarif diambil otomatis (tanpa tombol) begitu tujuan tersedia;
// tiga tarif termurah tampil lebih dulu, sisanya lewat "Selengkapnya". Biaya
// selalu dihitung server; nilai yang tampil hanya hasil dari server. Parent
// me-remount lewat `key` saat tujuan berubah, jadi state di sini tidak perlu
// di-reset manual.
export function CourierPicker({
  variantIds,
  destinationId,
  configured,
  onSelect,
}: CourierPickerProps) {
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [source, setSource] = useState<"api" | "fallback" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const waitingForDestination = configured && !destinationId;

  useEffect(() => {
    // Tanpa API ongkir, tarif flat tetap dihitung walau tujuan kosong.
    if (configured && !destinationId) return;

    let active = true;
    apiRequest<{ source: "api" | "fallback"; options: ShippingOption[] }>(
      "/api/shipping",
      {
        method: "POST",
        body: JSON.stringify({ destinationId, variantIds }),
      },
    )
      .then((quote) => {
        if (!active) return;
        const sorted = [...quote.options].sort((a, b) => a.cost - b.cost);
        setOptions(sorted);
        setSource(quote.source);
        const first = sorted[0] ?? null;
        setSelectedKey(first ? optionKey(first) : null);
        onSelect(first);
      })
      .catch((caught) => {
        if (!active) return;
        setError(toErrorMessage(caught));
        setOptions([]);
        setSelectedKey(null);
        onSelect(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [destinationId, variantIds, configured, onSelect]);

  function choose(option: ShippingOption) {
    setSelectedKey(optionKey(option));
    onSelect(option);
  }

  if (waitingForDestination) {
    return (
      <p className="text-xs text-muted-foreground">
        Pilih kecamatan tujuan dulu untuk melihat tarif pengiriman.
      </p>
    );
  }

  if (loading) {
    return (
      <p className="text-xs text-muted-foreground">
        Menghitung tarif pengiriman...
      </p>
    );
  }

  if (error) {
    return <p className="text-xs text-destructive">{error}</p>;
  }

  if (options.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        Tarif pengiriman tidak tersedia untuk tujuan ini.
      </p>
    );
  }

  // Kurir terpilih selalu ikut tampil walau di luar tiga termurah.
  const visible = expanded
    ? options
    : options.filter(
        (option, index) =>
          index < VISIBLE_COUNT || optionKey(option) === selectedKey,
      );
  const hiddenCount = options.length - visible.length;

  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-col divide-y divide-border rounded-md border border-border">
        {visible.map((option) => (
          <li key={optionKey(option)}>
            <label className="flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm hover:bg-accent/50">
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name="shippingOption"
                  value={optionKey(option)}
                  checked={selectedKey === optionKey(option)}
                  onChange={() => choose(option)}
                  className="h-4 w-4"
                />
                <span className="flex flex-col">
                  <span className="font-medium">
                    {option.courier} {option.service}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {option.description || "Layanan pengiriman"} - {option.etd}
                  </span>
                </span>
              </span>
              <span className="whitespace-nowrap font-medium">
                {formatRupiah(option.cost)}
              </span>
            </label>
          </li>
        ))}
      </ul>

      {source === "fallback" ? (
        <p className="text-xs text-muted-foreground">
          Tarif flat sementara (Rp10.000). Ongkir asli dihitung saat API aktif.
        </p>
      ) : null}

      {hiddenCount > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="self-start text-xs font-medium text-primary hover:underline"
        >
          Selengkapnya ({hiddenCount} jasa pengiriman lain)
        </button>
      ) : null}
      {expanded && options.length > VISIBLE_COUNT ? (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="self-start text-xs font-medium text-primary hover:underline"
        >
          Sembunyikan
        </button>
      ) : null}
    </div>
  );
}
