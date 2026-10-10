"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type GuestOrderNoticeProps = {
  orderNumber: string;
  phone: string | null;
};

// Notifikasi email belum aktif (menyusul di PH-05), jadi guest hanya bisa
// membuka pesanan ini lagi lewat nomor pesanan + nomor HP. Kotak ini sengaja
// menonjol supaya guest menyimpannya sebelum meninggalkan halaman.
export function GuestOrderNotice({ orderNumber, phone }: GuestOrderNoticeProps) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold">Simpan data pesanan ini</h2>
        <p className="text-amber-900">
          Tidak menambahkan notifikasi email, jadi nomor pesanan dan nomor HP di bawah
          ini satu-satunya cara untuk membuka dan melacak pesanan ini lagi.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <CopyRow label="Nomor pesanan" value={orderNumber} />
        {phone ? <CopyRow label="Nomor HP" value={phone} /> : null}
      </div>
      <Link
        href="/track-order"
        className="w-fit text-xs font-medium text-amber-900 underline underline-offset-4"
      >
        Buka halaman lacak pesanan
      </Link>
    </section>
  );
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard bisa diblokir (mis. bukan HTTPS). Nilai tetap terbaca di layar.
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200 bg-white/70 px-3 py-2">
      <span className="flex flex-col">
        <span className="text-xs text-amber-800">{label}</span>
        <span className="font-medium">{value}</span>
      </span>
      <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
        {copied ? "Tersalin" : "Salin"}
      </Button>
    </div>
  );
}
