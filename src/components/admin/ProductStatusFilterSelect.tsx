"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Filter status di halaman daftar produk (Server Component + form GET).
// Select Radix tidak ikut disubmit form, jadi nilainya dibawa hidden input;
// sentinel "__all__" dipetakan ke "" agar URL filter tetap seperti sebelumnya
// (tanpa parameter berarti semua status).
export function ProductStatusFilterSelect({
  defaultValue,
  options,
}: {
  defaultValue: string;
  options: { value: string; label: string }[];
}) {
  const [value, setValue] = useState(defaultValue || "__all__");

  return (
    <>
      <input type="hidden" name="status" value={value === "__all__" ? "" : value} />
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="sm:max-w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Semua status</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
