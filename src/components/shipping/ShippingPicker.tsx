"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";
import { formatRupiah } from "@/lib/utils/format";

export type ShippingOption = {
  courier: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
};

export type ShippingDestination = { id: string; label: string };

type ShippingPickerProps = {
  variantIds: string[];
  configured: boolean;
  onSelect: (
    option: ShippingOption | null,
    destination: ShippingDestination | null,
  ) => void;
  calculateLabel?: string;
};

const optionKey = (option: ShippingOption) => `${option.code}:${option.service}`;

// Pemilih tujuan + kurir yang dipakai bersama oleh /cart (estimasi) dan
// /checkout (pilihan resmi). Biaya selalu dihitung server dari item terpilih;
// nilai yang tampil di sini hanya hasil dari server.
export function ShippingPicker({
  variantIds,
  configured,
  onSelect,
  calculateLabel,
}: ShippingPickerProps) {
  const [search, setSearch] = useState("");
  const [cities, setCities] = useState<ShippingDestination[]>([]);
  const [searching, setSearching] = useState(false);
  const [destination, setDestination] = useState<ShippingDestination | null>(null);
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [source, setSource] = useState<"api" | "fallback" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // Pencarian tujuan di-debounce supaya tidak membanjiri API eksternal.
  // setState hanya dipanggil di dalam callback timer (async), bukan di badan
  // effect, supaya tidak memicu render berantai.
  useEffect(() => {
    const term = search.trim();
    if (!configured || term.length < 3) return;

    let active = true;
    const timer = setTimeout(async () => {
      if (!active) return;
      setSearching(true);
      try {
        const result = await apiRequest<{ cities: ShippingDestination[] }>(
          `/api/shipping/cities?search=${encodeURIComponent(term)}`,
        );
        if (active) setCities(result.cities);
      } catch {
        if (active) setCities([]);
      } finally {
        if (active) setSearching(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search, configured]);

  async function calculate() {
    setError(null);
    setPending(true);
    try {
      const quote = await apiRequest<{
        source: "api" | "fallback";
        options: ShippingOption[];
      }>("/api/shipping", {
        method: "POST",
        body: JSON.stringify({ destinationId: destination?.id, variantIds }),
      });
      setOptions(quote.options);
      setSource(quote.source);
      const first = quote.options[0] ?? null;
      setSelectedKey(first ? optionKey(first) : null);
      onSelect(first, destination);
    } catch (caught) {
      setError(toErrorMessage(caught));
      setOptions([]);
      setSelectedKey(null);
      onSelect(null, destination);
    } finally {
      setPending(false);
    }
  }

  function choose(option: ShippingOption) {
    setSelectedKey(optionKey(option));
    onSelect(option, destination);
  }

  return (
    <div className="flex flex-col gap-3">
      {configured ? (
        <>
          <div className="flex flex-col gap-2">
            <Label htmlFor="shipping-search">Kecamatan / kota tujuan</Label>
            <Input
              id="shipping-search"
              value={destination ? destination.label : search}
              placeholder="Contoh: Cilandak"
              autoComplete="off"
              onChange={(event) => {
                setDestination(null);
                setCities([]);
                setOptions([]);
                setSelectedKey(null);
                setSource(null);
                onSelect(null, null);
                setSearch(event.target.value);
              }}
            />
            {searching ? (
              <p className="text-xs text-muted-foreground">Mencari tujuan...</p>
            ) : null}
            {!destination && cities.length > 0 ? (
              <ul className="max-h-48 overflow-auto rounded-md border border-border">
                {cities.map((city) => (
                  <li key={city.id}>
                    <button
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm hover:bg-accent"
                      onClick={() => {
                        setDestination(city);
                        setCities([]);
                        setOptions([]);
                        setSelectedKey(null);
                        setSource(null);
                        onSelect(null, city);
                      }}
                    >
                      {city.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <Button
            type="button"
            onClick={calculate}
            disabled={pending || !destination}
          >
            {pending ? "Menghitung..." : (calculateLabel ?? "Hitung Ongkos Kirim")}
          </Button>
        </>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">
            API ongkir belum aktif, jadi tarif flat sementara yang dipakai.
          </p>
          <Button type="button" onClick={calculate} disabled={pending}>
            {pending ? "Menghitung..." : "Gunakan Tarif Flat"}
          </Button>
        </>
      )}

      {source === "fallback" && options.length > 0 ? (
        <p className="text-xs text-muted-foreground">
          Tarif flat sementara (Rp10.000). Ongkir asli dihitung saat API aktif.
        </p>
      ) : null}

      {options.length > 0 ? (
        <ul className="flex flex-col divide-y divide-border rounded-md border border-border">
          {options.map((option) => (
            <li key={optionKey(option)}>
              <label className="flex cursor-pointer items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-accent/50">
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
                <span className="font-medium">{formatRupiah(option.cost)}</span>
              </label>
            </li>
          ))}
        </ul>
      ) : null}

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
