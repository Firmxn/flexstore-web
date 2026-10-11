"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "price-asc", label: "Harga termurah" },
  { value: "price-desc", label: "Harga termahal" },
  { value: "name-asc", label: "Nama A-Z" },
] as const;

// Filter katalog (PRD 3.1.A): kisaran harga + urutan. Nilai dirakit ulang dari
// query yang sedang aktif supaya search/kategori tidak hilang saat difilter.
export function CatalogFilters({
  search,
  category,
  minPrice,
  maxPrice,
  sort,
}: {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort: string;
}) {
  const router = useRouter();
  const [min, setMin] = useState(minPrice ?? "");
  const [max, setMax] = useState(maxPrice ?? "");

  function push(nextMin: string, nextMax: string, nextSort: string) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (nextMin) params.set("minPrice", nextMin);
    if (nextMax) params.set("maxPrice", nextMax);
    if (nextSort && nextSort !== "newest") params.set("sort", nextSort);
    const qs = params.toString();
    router.push(qs ? `/products?${qs}` : "/products");
  }

  const isFiltered = Boolean(min || max) || sort !== "newest";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        push(min.trim(), max.trim(), sort);
      }}
      className="flex flex-wrap items-center gap-2"
    >
      <Input
        inputMode="numeric"
        value={min}
        onChange={(event) => setMin(event.target.value.replace(/[^\d]/g, ""))}
        placeholder="Harga min"
        aria-label="Harga minimum"
        className="h-9 w-28"
      />
      <span className="text-sm text-muted-foreground">-</span>
      <Input
        inputMode="numeric"
        value={max}
        onChange={(event) => setMax(event.target.value.replace(/[^\d]/g, ""))}
        placeholder="Harga max"
        aria-label="Harga maksimum"
        className="h-9 w-28"
      />

      <select
        value={sort}
        onChange={(event) => push(min.trim(), max.trim(), event.target.value)}
        aria-label="Urutkan produk"
        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <Button type="submit" size="sm" variant="outline" className="h-9">
        Terapkan
      </Button>

      {isFiltered ? (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-9"
          onClick={() => {
            setMin("");
            setMax("");
            push("", "", "newest");
          }}
        >
          Reset
        </Button>
      ) : null}
    </form>
  );
}
