"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";
import { formatRupiah } from "@/lib/utils/format";

type City = { id: string; label: string };
type ShippingOption = {
  courier: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
};

type CartSummaryProps = {
  subtotal: number;
  itemCount: number;
  shippingConfigured: boolean;
};

const optionKey = (option: ShippingOption) => `${option.code}:${option.service}`;

export function CartSummary({
  subtotal,
  itemCount,
  shippingConfigured,
}: CartSummaryProps) {
  const [search, setSearch] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [searching, setSearching] = useState(false);
  const [destination, setDestination] = useState<City | null>(null);
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
    if (!shippingConfigured || term.length < 3) return;

    let active = true;
    const timer = setTimeout(async () => {
      if (!active) return;
      setSearching(true);
      try {
        const result = await apiRequest<{ cities: City[] }>(
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
  }, [search, shippingConfigured]);

  async function calculate() {
    setError(null);
    setPending(true);
    try {
      const quote = await apiRequest<{
        source: "api" | "fallback";
        options: ShippingOption[];
      }>("/api/shipping", {
        method: "POST",
        body: JSON.stringify({ destinationId: destination?.id }),
      });
      setOptions(quote.options);
      setSource(quote.source);
      setSelectedKey(quote.options[0] ? optionKey(quote.options[0]) : null);
    } catch (caught) {
      setError(toErrorMessage(caught));
      setOptions([]);
      setSelectedKey(null);
    } finally {
      setPending(false);
    }
  }

  const selected = options.find((option) => optionKey(option) === selectedKey) ?? null;
  const total = subtotal + (selected?.cost ?? 0);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4">
      <h2 className="font-semibold">Ringkasan</h2>

      <dl className="flex flex-col gap-2 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Subtotal ({itemCount} item)</dt>
          <dd>{formatRupiah(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Ongkos kirim</dt>
          <dd>{selected ? formatRupiah(selected.cost) : "-"}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2 font-semibold">
          <dt>Total</dt>
          <dd>{formatRupiah(total)}</dd>
        </div>
      </dl>

      <div className="flex flex-col gap-3 border-t border-border pt-4">
        <h3 className="text-sm font-semibold">Ongkos Kirim</h3>

        {shippingConfigured ? (
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
              {pending ? "Menghitung..." : "Hitung Ongkos Kirim"}
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
                      onChange={() => setSelectedKey(optionKey(option))}
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

      <Button type="button" disabled className="w-full">
        Checkout (tersedia di PH-03)
      </Button>
    </div>
  );
}
