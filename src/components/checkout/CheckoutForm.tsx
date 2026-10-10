"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OtpVerificationForm } from "@/components/auth/OtpVerificationForm";
import { CourierPicker } from "@/components/shipping/CourierPicker";
import { DestinationPicker } from "@/components/shipping/DestinationPicker";
import type {
  ShippingDestination,
  ShippingOption,
} from "@/components/shipping/types";
import { ApiError, apiRequest, toErrorMessage } from "@/lib/utils/fetcher";
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

type VoucherValidateResponse = {
  valid: boolean;
  subtotal: number;
  discount: {
    productDiscount: number;
    shippingDiscount: number;
    totalDiscount: number;
  };
  errors: { code: string; reason: string }[];
};

// ORDER-01/ORDER-02: form pembuatan pesanan. Guest wajib melewati OTP dulu;
// customer memakai data akun. Titik tujuan dipilih lebih dulu supaya
// provinsi/kota/kecamatan/kelurahan/kode pos terisi otomatis. Tarif kurir
// dihitung otomatis dan tampil di kolom ringkasan; ongkir dihitung ulang oleh
// server saat submit.
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
  const [destination, setDestination] = useState<ShippingDestination | null>(null);
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [subdistrict, setSubdistrict] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [street, setStreet] = useState("");
  const [note, setNote] = useState("");
  const [shipping, setShipping] = useState<ShippingOption | null>(null);
  const [voucherInput, setVoucherInput] = useState("");
  const [voucherCodes, setVoucherCodes] = useState<string[]>([]);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherErrors, setVoucherErrors] = useState<
    { code: string; reason: string }[]
  >([]);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // Identitas varian stabil supaya efek CourierPicker tidak berjalan ulang tiap
  // render.
  const variantIds = useMemo(
    () => items.map((item) => item.variantId),
    [items],
  );

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

  // Field wilayah terisi otomatis dari titik tujuan dan jadi read-only. Selama
  // titik belum dipilih (dan API ongkir aktif) field dinonaktifkan; saat API
  // ongkir tidak aktif field diisi manual.
  const autoCity = Boolean(destination?.cityName);
  const autoProvince = Boolean(destination?.provinceName);
  const autoDistrict = Boolean(destination?.districtName);
  const autoSubdistrict = Boolean(destination?.subdistrictName);
  const autoPostal = Boolean(destination?.zipCode);
  const regionLocked = shippingConfigured && !destination;

  const shippingCost = shipping?.cost ?? 0;
  const total = subtotal + shippingCost - voucherDiscount;

  // Voucher divalidasi server (subtotal dihitung ulang dari keranjang), jadi
  // angka diskon di ringkasan selalu berasal dari server (PRD 5.3).
  async function validateVouchers(codes: string[], cost: number) {
    if (codes.length === 0) {
      setVoucherDiscount(0);
      setVoucherErrors([]);
      return;
    }

    setVoucherLoading(true);
    try {
      const result = await apiRequest<VoucherValidateResponse>(
        "/api/vouchers/validate",
        {
          method: "POST",
          body: JSON.stringify({
            codes,
            variantIds,
            shippingCost: cost,
            phone,
          }),
        },
      );
      setVoucherErrors(result.errors);
      setVoucherDiscount(result.valid ? result.discount.totalDiscount : 0);
    } catch (caught) {
      setVoucherErrors([{ code: "", reason: toErrorMessage(caught) }]);
      setVoucherDiscount(0);
    } finally {
      setVoucherLoading(false);
    }
  }

  function handleAddVoucher() {
    const code = voucherInput.trim().toUpperCase();
    if (!code) return;
    if (voucherCodes.includes(code)) {
      setVoucherInput("");
      return;
    }
    const next = [...voucherCodes, code].slice(0, 2);
    setVoucherCodes(next);
    setVoucherInput("");
    void validateVouchers(next, shippingCost);
  }

  function handleRemoveVoucher(code: string) {
    const next = voucherCodes.filter((item) => item !== code);
    setVoucherCodes(next);
    void validateVouchers(next, shippingCost);
  }

  function handleShipping(value: ShippingOption | null) {
    setShipping(value);
    // Voucher ongkir bergantung pada tarif terpilih, jadi divalidasi ulang.
    if (voucherCodes.length > 0) {
      void validateVouchers(voucherCodes, value?.cost ?? 0);
    }
  }

  function handleDestination(value: ShippingDestination | null) {
    setDestination(value);
    // Tarif lama tidak relevan saat tujuan berubah; CourierPicker mengisi ulang.
    setShipping(null);
    if (!value) {
      // Titik direset: kosongkan field wilayah supaya tidak ada sisa data lama.
      setProvince("");
      setCity("");
      setDistrict("");
      setSubdistrict("");
      setPostalCode("");
      return;
    }
    if (value.provinceName) setProvince(value.provinceName);
    if (value.cityName) setCity(value.cityName);
    if (value.districtName) setDistrict(value.districtName);
    if (value.subdistrictName) setSubdistrict(value.subdistrictName);
    if (value.zipCode) setPostalCode(value.zipCode);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (shippingConfigured && !destination) {
      setError("Pilih titik tujuan pengiriman terlebih dahulu");
      return;
    }

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
            variantIds,
            destinationId: destination?.id,
            courierCode: shipping.code,
            service: shipping.service,
            address: {
              name,
              phone,
              street,
              city,
              province,
              district: district || undefined,
              subdistrict: subdistrict || undefined,
              postalCode,
              note: note || undefined,
            },
            guestPhone: mode === "guest" ? verifiedPhone : undefined,
            guestEmail: email || undefined,
            voucherCodes,
          }),
        },
      );
      // Pesanan tersimpan sebagai WAITING_PAYMENT. Lanjut ke halaman pesanan
      // yang sama untuk guest dan customer (ada tombol bayar + batas waktu).
      router.push(`/orders/${result.order.id}`);
    } catch (caught) {
      // Penanda OTP hilang/kedaluwarsa di server: kembalikan ke langkah
      // verifikasi supaya guest bisa memverifikasi ulang.
      if (caught instanceof ApiError && caught.code === "PHONE_NOT_VERIFIED") {
        setVerifiedPhone(null);
      }
      setError(toErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-6">
        {mode === "guest" ? (
          <Alert className="flex flex-col gap-1">
            <span>
              Nomor HP terverifikasi: <strong>{verifiedPhone}</strong>
            </span>
            <span className="text-muted-foreground">
              Setelah pesanan dibuat, simpan nomor pesanan dan nomor HP-nya.
              Tidak menambahkan notifikasi email, jadi keduanya diperlukan untuk melacak
              pesanan.
            </span>
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

            {shippingConfigured ? (
              <div className="sm:col-span-2">
                <DestinationPicker
                  configured={shippingConfigured}
                  selected={destination}
                  onSelect={handleDestination}
                />
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-2 sm:col-span-2">
              <h3 className="text-sm font-medium">Wilayah tujuan</h3>
              {shippingConfigured ? (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  otomatis dari titik tujuan
                </span>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="checkout-province">Provinsi</Label>
              <Input
                id="checkout-province"
                required
                disabled={regionLocked}
                readOnly={autoProvince}
                className={autoProvince ? "bg-muted" : undefined}
                value={province}
                onChange={(event) => setProvince(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="checkout-city">Kota/Kabupaten</Label>
              <Input
                id="checkout-city"
                required
                disabled={regionLocked}
                readOnly={autoCity}
                className={autoCity ? "bg-muted" : undefined}
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="checkout-district">Kecamatan</Label>
              <Input
                id="checkout-district"
                disabled={regionLocked}
                readOnly={autoDistrict}
                className={autoDistrict ? "bg-muted" : undefined}
                value={district}
                onChange={(event) => setDistrict(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="checkout-subdistrict">Kelurahan/Desa</Label>
              <Input
                id="checkout-subdistrict"
                disabled={regionLocked}
                readOnly={autoSubdistrict}
                className={autoSubdistrict ? "bg-muted" : undefined}
                value={subdistrict}
                onChange={(event) => setSubdistrict(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="checkout-postal">Kode pos</Label>
              <Input
                id="checkout-postal"
                required
                disabled={regionLocked}
                readOnly={autoPostal}
                className={autoPostal ? "bg-muted" : undefined}
                inputMode="numeric"
                value={postalCode}
                onChange={(event) => setPostalCode(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="checkout-street">Alamat lengkap</Label>
              <Textarea
                id="checkout-street"
                required
                rows={3}
                placeholder="Jalan, nomor rumah, RT/RW"
                value={street}
                onChange={(event) => setStreet(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="checkout-note">Catatan (opsional)</Label>
              <Textarea
                id="checkout-note"
                rows={2}
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

        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <h3 className="text-sm font-semibold">Metode Pengiriman</h3>
          <CourierPicker
            key={destination?.id ?? "flat"}
            variantIds={variantIds}
            destinationId={destination?.id}
            configured={shippingConfigured}
            onSelect={handleShipping}
          />
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <h3 className="text-sm font-semibold">Voucher</h3>
          <div className="flex gap-2">
            <Input
              value={voucherInput}
              maxLength={30}
              placeholder="Kode voucher"
              aria-label="Kode voucher"
              onChange={(event) => setVoucherInput(event.target.value.toUpperCase())}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddVoucher}
              disabled={
                voucherLoading ||
                voucherInput.trim() === "" ||
                voucherCodes.length >= 2
              }
            >
              Tambah
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Maksimal 2 voucher per transaksi.
          </p>

          {voucherCodes.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {voucherCodes.map((code) => (
                <li
                  key={code}
                  className="flex flex-col gap-1 rounded-lg border border-border bg-muted/40 px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold">{code}</span>
                    <button
                      type="button"
                      className="text-xs text-destructive hover:underline"
                      onClick={() => handleRemoveVoucher(code)}
                    >
                      Hapus
                    </button>
                  </div>
                  {voucherErrors
                    .filter((item) => item.code === code)
                    .map((item, index) => (
                      <p key={`${code}-${index}`} className="text-xs text-destructive">
                        {item.code}: {item.reason}
                      </p>
                    ))}
                </li>
              ))}
            </ul>
          ) : null}

          {voucherErrors
            .filter((item) => item.code === "")
            .map((item, index) => (
              <p key={`error-${index}`} className="text-xs text-destructive">
                {item.reason}
              </p>
            ))}
          {voucherLoading ? (
            <p className="text-xs text-muted-foreground">Memeriksa voucher...</p>
          ) : null}
        </div>

        <dl className="flex flex-col gap-2 border-t border-border pt-4 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd>{formatRupiah(subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Ongkos kirim</dt>
            <dd>{shipping ? formatRupiah(shipping.cost) : "-"}</dd>
          </div>
          {voucherDiscount > 0 ? (
            <div className="flex items-center justify-between text-success">
              <dt>Diskon voucher</dt>
              <dd>-{formatRupiah(voucherDiscount)}</dd>
            </div>
          ) : null}
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
