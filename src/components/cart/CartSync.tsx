"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/utils/fetcher";

// Setelah login/registrasi, keranjang guest digabung ke keranjang customer.
// LoginForm dan RegisterForm sudah memanggilnya langsung; komponen ini jadi
// jaring pengaman untuk sesi yang sudah aktif sebelum halaman dibuka (mis.
// tab lain), dan hanya berjalan sekali per sesi browser.
const FLAG = "flexstore_cart_synced";

export function CartSync() {
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem(FLAG)) return;
    sessionStorage.setItem(FLAG, "1");

    apiRequest<{ merged: number }>("/api/cart/sync", { method: "POST" })
      .then((result) => {
        if (result.merged > 0) router.refresh();
      })
      .catch(() => {
        // Sinkronisasi gagal bukan kesalahan fatal; keranjang guest tetap utuh.
      });
  }, [router]);

  return null;
}
