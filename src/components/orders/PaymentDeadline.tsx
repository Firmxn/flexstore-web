"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDateTime } from "@/lib/utils/format";

// Hitung mundur batas bayar. Saat waktu habis, server dipanggil ulang sekali
// supaya reservasi yang lewat langsung dilepas (pesanan jadi CANCELED).
export function PaymentDeadline({ deadline }: { deadline: string }) {
  const router = useRouter();
  const target = new Date(deadline).getTime();
  const [now, setNow] = useState<number | null>(null);
  const refreshed = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (now !== null && now >= target && !refreshed.current) {
      refreshed.current = true;
      router.refresh();
    }
  }, [now, target, router]);

  // Render pertama (server + klien) sama-sama memakai waktu absolut supaya
  // tidak ada hydration mismatch; hitung mundur muncul setelah mount.
  if (now === null) {
    return (
      <p className="text-xs text-muted-foreground">
        Bayar sebelum {formatDateTime(deadline)} agar pesanan tidak dibatalkan
        otomatis.
      </p>
    );
  }

  const remaining = target - now;
  if (remaining <= 0) {
    return (
      <p className="text-xs font-medium text-destructive">
        Batas waktu pembayaran terlewat. Pesanan dibatalkan otomatis.
      </p>
    );
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts = [
    hours > 0 ? `${hours} jam` : null,
    `${minutes} menit`,
    `${seconds} detik`,
  ].filter(Boolean);

  return (
    <p className="text-xs text-muted-foreground">
      Bayar dalam {parts.join(" ")} (sebelum {formatDateTime(deadline)}) agar
      pesanan tidak dibatalkan otomatis.
    </p>
  );
}
