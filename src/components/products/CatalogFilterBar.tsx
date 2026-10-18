"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter as FilterIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "price-asc", label: "Harga termurah" },
  { value: "price-desc", label: "Harga termahal" },
  { value: "name-asc", label: "Nama A-Z" },
] as const;

// Filter minimalis di samping heading katalog: input pencarian + tombol Filter
// yang membuka popover (harga min/max + urutan).
//
// Perilaku:
// - Pencarian: ketik lalu tekan Enter untuk mencari segera (tidak perlu
//   menekan Terapkan). Ikon X di ujung kanan input menghapus pencarian.
// - Filter (harga + urutan): hanya diterapkan saat tombol Terapkan ditekan.
//   Saat pencarian + filter digabung, menekan Terapkan menerapkan keduanya.
export function CatalogFilterBar({
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
  const [query, setQuery] = useState(search ?? "");
  const [min, setMin] = useState(minPrice ?? "");
  const [max, setMax] = useState(maxPrice ?? "");
  const [sortValue, setSortValue] = useState(sort);

  function buildParams(extra: Record<string, string>): string {
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (category) params.set("category", category);
    for (const [key, value] of Object.entries(extra)) {
      if (value) params.set(key, value);
    }
    const qs = params.toString();
    return qs ? `/products?${qs}` : "/products";
  }

  function searchOnly() {
    router.push(buildParams({}));
  }

  function applyFilters() {
    const extra: Record<string, string> = {};
    if (min.trim()) extra.minPrice = min.trim();
    if (max.trim()) extra.maxPrice = max.trim();
    if (sortValue && sortValue !== "newest") extra.sort = sortValue;
    router.push(buildParams(extra));
  }

  function clearSearch() {
    setQuery("");
    router.push(buildParams({}));
  }

  function resetFilters() {
    setMin("");
    setMax("");
    setSortValue(sort);
    router.push(buildParams({}));
  }

  const isFiltered = Boolean(min || max) || sortValue !== "newest";

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") searchOnly();
          }}
          placeholder="Type Product..."
          maxLength={200}
          aria-label="Cari produk"
          className="h-10 w-full rounded-lg pl-9 pr-9"
        />
        {query.trim() && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-0 hover:text-destructive transition-colors"
            aria-label="Hapus pencarian"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      <Popover modal={false}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-10 sm:h-9 rounded-lg px-3 sm:px-4 flex items-center gap-2 text-sm sm:text-base"
          >
            <FilterIcon className="size-4" />
            Filter
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px]">
          <div className="space-y-3">
            <Input
              inputMode="numeric"
              value={min}
              onChange={(event) =>
                setMin(event.target.value.replace(/[^\d]/g, ""))
              }
              placeholder="Harga min"
              className="h-9 rounded-lg"
            />
            <Input
              inputMode="numeric"
              value={max}
              onChange={(event) =>
                setMax(event.target.value.replace(/[^\d]/g, ""))
              }
              placeholder="Harga max"
              className="h-9 rounded-lg"
            />
            <Select value={sortValue} onValueChange={setSortValue}>
              <SelectTrigger className="h-9 rounded-lg">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                onClick={applyFilters}
                size="sm"
                className="h-9 flex-1 rounded-lg"
              >
                Terapkan
              </Button>
              {isFiltered && (
                <Button
                  onClick={resetFilters}
                  size="sm"
                  variant="outline"
                  className="h-9 flex-1 rounded-lg"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
