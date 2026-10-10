"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/utils/fetcher";
import type { ShippingDestination } from "./types";

type DestinationPickerProps = {
  configured: boolean;
  selected: ShippingDestination | null;
  onSelect: (destination: ShippingDestination | null) => void;
};

// Nama kecamatan untuk ditampilkan di input. Kota/provinsi/kode pos tidak
// diulang di input karena sudah tampil di field read-only terpisah; detail
// lengkapnya tetap ada di daftar dropdown.
const districtLabel = (destination: ShippingDestination) =>
  destination.districtName || destination.label;

// Pemilih titik tujuan di /checkout. Satu pilihan mengisi provinsi, kota,
// kecamatan, kelurahan, dan kode pos (field turunan, read-only). Ini titik
// administratif; titik akurat via peta menyusul sebagai layer terpisah.
export function DestinationPicker({
  configured,
  selected,
  onSelect,
}: DestinationPickerProps) {
  const [search, setSearch] = useState("");
  const [cities, setCities] = useState<ShippingDestination[]>([]);
  const [searching, setSearching] = useState(false);
  // Cache sisi klien: hasil pencarian yang sama tidak perlu bolak-balik ke
  // server. Hanya hasil tidak kosong yang disimpan supaya kegagalan (mis. kuota
  // RajaOngkir habis) tidak "meracuni" cache.
  const cacheRef = useRef<Map<string, ShippingDestination[]>>(new Map());

  // Pencarian tujuan di-debounce supaya tidak membanjiri API eksternal.
  // setState hanya dipanggil di dalam callback timer (async), bukan di badan
  // effect, supaya tidak memicu render berantai. Term yang sudah pernah dicari
  // dijawab instan dari cache (tanpa delay debounce).
  useEffect(() => {
    const term = search.trim();
    if (!configured || term.length < 3) return;

    const key = term.toLowerCase();
    const cached = cacheRef.current.get(key);

    let active = true;
    const timer = setTimeout(
      async () => {
        if (!active) return;
        if (cached) {
          setCities(cached);
          setSearching(false);
          return;
        }
        setSearching(true);
        try {
          const result = await apiRequest<{ cities: ShippingDestination[] }>(
            `/api/shipping/cities?search=${encodeURIComponent(term)}`,
          );
          if (!active) return;
          if (result.cities.length > 0) cacheRef.current.set(key, result.cities);
          setCities(result.cities);
        } catch {
          if (active) setCities([]);
        } finally {
          if (active) setSearching(false);
        }
      },
      cached ? 0 : 250,
    );

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search, configured]);

  if (!configured) return null;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="destination-search">Titik tujuan</Label>
      <Input
        id="destination-search"
        value={selected ? districtLabel(selected) : search}
        placeholder="Contoh: Cilandak"
        autoComplete="off"
        onChange={(event) => {
          const value = event.target.value;
          onSelect(null);
          setCities([]);
          setSearch(value);
          // Umpan balik instan: tandai "mencari" begitu ketikan mencapai 3 huruf.
          setSearching(value.trim().length >= 3);
        }}
      />
      {!selected && search.trim().length < 3 ? (
        <p className="text-xs text-muted-foreground">
          Ketik nama kelurahan/kecamatan (min. 3 huruf), lalu pilih titik dari
          daftar.
        </p>
      ) : null}
      {searching ? (
        <p className="text-xs text-muted-foreground">Mencari tujuan...</p>
      ) : null}
      {!selected && cities.length > 0 ? (
        <ul className="max-h-48 overflow-auto rounded-md border border-border">
          {cities.map((city) => (
            <li key={city.id}>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-accent"
                onClick={() => {
                  onSelect(city);
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
  );
}
