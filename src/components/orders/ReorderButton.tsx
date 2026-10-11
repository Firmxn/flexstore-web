"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";

type ReorderResponse = {
  added: number;
  skipped: { productName: string; reason: string }[];
};

// ORDER-03 lanjutan (PH-07): "Pesan Lagi" menambahkan varian dari pesanan lama
// ke keranjang. Hasil parsial (sebagian dilewati) tetap dianggap berhasil dan
// alasannya ditampilkan supaya pembeli tahu.
export function ReorderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [result, setResult] = useState<ReorderResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const data = await apiRequest<ReorderResponse>(
        `/api/orders/${orderId}/reorder`,
        { method: "POST" },
      );
      setResult(data);
      router.refresh();
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? "Menambahkan..." : "Pesan Lagi"}
      </Button>

      {result ? (
        <div className="text-right text-xs text-muted-foreground">
          <p className="text-foreground">
            {result.added} item ditambahkan.{" "}
            <Link href="/cart" className="underline">
              Lihat keranjang
            </Link>
          </p>
          {result.skipped.map((item, index) => (
            <p key={`${item.productName}-${index}`}>
              {item.productName}: {item.reason}
            </p>
          ))}
        </div>
      ) : null}

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
