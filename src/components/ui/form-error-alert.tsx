"use client";

import { useEffect, useRef } from "react";
import { Alert } from "./alert";

// Pesan kesalahan tombol submit sering jauh dari pesan itu sendiri (form
// panjang, dialog, dst.), jadi begitu pesan muncul/berubah kontainernya
// langsung digulir ke tengah viewport — tanpa scroll manual. Guliran memakai
// gerak instan (bukan animasi halus) supaya pasti jalan di semua kondisi.
// Permintaan pengguna (2026-10-11, "semua fitur serupa, bukan hanya alamat
// saya").
export function FormErrorAlert({ message }: { message: string | null }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!message || !element) return;
    element.scrollIntoView({ behavior: "auto", block: "center" });
  }, [message]);

  if (!message) return null;

  return (
    <div ref={containerRef}>
      <Alert variant="destructive">{message}</Alert>
    </div>
  );
}
