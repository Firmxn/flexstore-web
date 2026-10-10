"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const POLL_INTERVAL_MS = 10_000;

// Selagi pembayaran belum lunas, minta server memuat ulang halaman secara
// berkala. Server yang menanyakan status terkini ke Xendit (rekonsiliasi).
//
// Biasanya tidak terasa: setelah bayar, Xendit redirect balik ke halaman ini
// dan status sudah diperbarui saat halaman dimuat. Polling ini menutup celah
// kalau redirect tiba sebelum status di sisi Xendit terbarui, atau kalau
// pembayaran asinkron (mis. VA) baru lunas beberapa saat kemudian. Komponen
// berhenti sendiri begitu status pesanan bukan WAITING_PAYMENT lagi.
export function PaymentStatusWatcher() {
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => router.refresh(), POLL_INTERVAL_MS);
    const onFocus = () => router.refresh();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [router]);

  return null;
}
