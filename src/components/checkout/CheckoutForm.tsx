"use client";

import { useState } from "react";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OtpVerificationForm } from "@/components/auth/OtpVerificationForm";
import {
  ShippingPicker,
  type ShippingDestination,
  type ShippingOption,
} from "@/components/shipping/ShippingPicker";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";
import { formatRupiah } from "@/lib/utils/format";

export type CheckoutItem = {
  variantId: string;
  productName: string;
  variantName: string;
  sku: string;
  price: number;
  quantity: number;
};

type CheckoutFormProps = {
  mode: "guest" | "user";
  items: CheckoutItem[];
  subtotal: number;
  shippingConfigured: boolean;
  defaults: { name: string; email: string; phone: string };
};

type CreatedOrder = { id: string; orderNumber: string; total: number };

// ORDER-01/ORDER-02: form pembuatan pesanan. Guest wajib melewati OTP dulu;
// customer memakai data akun. Ongkir dipilih lewat ShippingPicker dan dihitung
// ulang oleh server saat pesanan dibuat.
export function CheckoutForm({
  mode,
  items,
  subtotal,
  shippingConfigured,
  defaults,
}: CheckoutFormProps) {
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(
    mode === "user" ? "akun" : null,
  );
  const [name, setName] = useState(defaults.name);
  const [email, setEmail] = useState(defaults.email);
  const [phone, setPhone] = useState(defaults.phone);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [note, setNote] = useState("");
  const [destination, setDestination] = useState<ShippingDestination | null>(null);
  const [shipping, setShipping] = useState<ShippingOption | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<CreatedOrder | null>(null);

  if (mode === "guest" && !verifiedPhone) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
        <div>
          <h2 className="font-semibold">Verifikasi nomor HP</h2>
          <p className="text-sm text-muted-foreground">
            Guest perlu memverifikasi nomor HP lewat OTP sebelum membuat
            pesanan.
          </p>
        </div>
        <OtpVerificationForm
          onVerified={(value) => {
            setVerifiedPhone(value);
            setPhone(value);
          }}
        />
      </div>
    );
  }

  if (created) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
        <Alert variant="success">
          Pesanan {created.orderNumber} berhasil dibuat.
        </Alert>
        <p className="text-sm text-muted-foreground">
          Total {formatRupiah(created.total)}. Reservasi stok berlaku 10 menit;
          pesanan dibatalkan otomatis bila belum dibayar.
        </p>
        <div className="flex flex-wrap gap-3">
          {mode === "user" ? (
            <Link href={`/orders/${created.id}`} className={buttonVariants()}>
              Lihat pesanan
            </Link>
          ) : (
            <Link href="/track-order" className={buttonVariants()}>
              Lacak pesanan
            </Link>
          )}
          <Link
            href="/products"
            className={buttonVariants({ variant: "outline" })}
          >
            Belanja lagi
          </Link>
        </div>
      </div>
    );
  }

  const total = subtotal + (shipping?.cost ?? 0);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!shipping) {
      setError("Pilih metode pengiriman terlebih dahulu");
      return;
    }

    setSubmitting(true);
    try {
      const result = await apiRequest<{ order: CreatedOrder }>(
        "/api/orders/create",
        {
          method: "POST",
          body: JSON.stringify({
            variantIds: items.map((item) => item.variantId),
            destinationId: destination?.id,
            courierCode: shipping.code,
            service: shipping.service,
            address: {
              name,
              phone,
              street,
              city,
              province,
              postalCode,
              note: note || undefined,
            },
            guestPhone: mode === "guest" ? verifiedPhone : undefined,
            guestEmail: email || undefined,
          }),
        },
      );
      setCreated(result.order);
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-6">
        {mode === "guest" ? (
          <Alert>
            Nomor HP terverifikasi: <strong>{verifiedPhone}</strong>
          </Alert>
        ) : null}

        <section className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
          <h2 className="font-semibold">Alamat Pengiriman</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="checkout-name">Nama penerima</Label>
              <Input
                id="checkout-name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="checkout-phone">Nomor HP penerima</Label>
              <Input
                id="checkout-phone"
                required
                inputMode="tel"
                placeholder="08123456789"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="checkout-street">Alamat lengkap</Label>
              <Input
                id="checkout-street"
                required
                placeholder="Jalan, nomor rumah, RT/RW"
                value={street}
                onChange={(event) => setStreet(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="checkout-city">Kota / kabupaten</Label>
              <Input
                id="checkout-city"
                required
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="checkout-province">Provinsi</Label>
              <Input
                id="checkout-province"
                required
                value={province}
                onChange={(event) => setProvince(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="checkout-postal">Kode pos</Label>
              <Input
                id="checkout-postal"
                required
                inputMode="numeric"
                value={postalCode}
                onChange={(event) => setPostalCode(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="checkout-note">Catatan (opsional)</Label>
              <Input
                id="checkout-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
            </div>
            {mode === "guest" ? (
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="checkout-email">Email (opsional)</Label>
                <Input
                  id="checkout-email"
                  type="email"
                  placeholder="nama@contoh.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Email dipakai untuk konfirmasi pesanan (aktif di PH-05).
                </p>
              </div>
            ) : null}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
          <h2 className="font-semibold">Metode Pengiriman</h2>
          <ShippingPicker
            variantIds={items.map((item) => item.variantId)}
            configured={shippingConfigured}
            calculateLabel="Hitung Ongkos Kirim"
            onSelect={(option, value) => {
              setShipping(option);
              setDestination(value);
            }}
          />
        </section>
      </div>

      <aside className="flex h-fit flex-col gap-4 rounded-xl border border-border bg-background p-4">
        <h2 className="font-semibold">Ringkasan Pesanan</h2>
        <ul className="flex flex-col gap-2 text-sm">
          {items.map((item) => (
            <li key={item.variantId} className="flex justify-between gap-2">
              <span className="min-w-0">
                <span className="block truncate">{item.productName}</span>
                <span className="text-xs text-muted-foreground">
                  {item.variantName} x{item.quantity}
                </span>
              </span>
              <span className="whitespace-nowrap">
                {formatRupiah(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="flex flex-col gap-2 border-t border-border pt-4 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd>{formatRupiah(subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Ongkos kirim</dt>
            <dd>{shipping ? formatRupiah(shipping.cost) : "-"}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-2 font-semibold">
            <dt>Total</dt>
            <dd>{formatRupiah(total)}</dd>
          </div>
        </dl>

        {error ? <Alert variant="destructive">{error}</Alert> : null}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Membuat pesanan..." : "Buat Pesanan"}
        </Button>
      </aside>
    </form>
  );
}
