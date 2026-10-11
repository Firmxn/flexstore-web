"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DestinationPicker } from "@/components/shipping/DestinationPicker";
import type { ShippingDestination } from "@/components/shipping/types";
import type { SavedAddress } from "@/lib/customers/view";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";
import {
  PHONE_INPUT_FILTER,
  POSTAL_CODE_INPUT_FILTER,
} from "@/lib/utils/validation";
import { FormErrorAlert } from "@/components/ui/form-error-alert";

// CUST-01 (PH-07): kelola alamat tersimpan customer. Daftar + form tambah/ubah
// dalam satu komponen supaya alur tetap ringkas; semua penegakan aturan (batas 5,
// alamat utama tunggal, kepemilikan) ada di server.

type AddressManagerProps = {
  addresses: SavedAddress[];
  shippingConfigured: boolean;
  maxAddresses: number;
};

function fullAddress(address: SavedAddress): string {
  return [
    address.street,
    address.subdistrict,
    address.district,
    address.city,
    address.province,
    address.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
}

export function AddressManager({
  addresses,
  shippingConfigured,
  maxAddresses,
}: AddressManagerProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<SavedAddress | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Daftar lokal: disinkronkan dari props server, lalu ditimpa optimis begitu
  // API simpan sukses â€” pengguna melihat data baru begitu tombol "Menyimpan..."
  // selesai, tanpa menunggu render ulang server (router.refresh tetap jalan
  // di background sebagai kebenaran final). Sinkronisasi memakai pola "adjust
  // state during render" (React-endorsed), bukan setState di effect.
  const [localAddresses, setLocalAddresses] = useState(addresses);
  const [prevAddresses, setPrevAddresses] = useState(addresses);
  if (addresses !== prevAddresses) {
    setPrevAddresses(addresses);
    setLocalAddresses(addresses);
  }
  // Anchor form "Tambah Alamat" supaya bisa di-scroll ke layar saat dibuka:
  // form ada di bawah daftar, jadi tanpa scroll user bisa melewatkannya.
  const createFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formOpen && !editing) {
      createFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [formOpen, editing]);

  // Terapkan hasil simpan optimis ke daftar lokal: alamat yang diubah
  // disesuaikan isinya; bila dijadikan utama, lencana utama pindah dari
  // alamat lain. Urutan dan aturan lain dikoreksi oleh refresh server.
  function applySaved(updated: SavedAddress) {
    setLocalAddresses((prev) => {
      const exists = prev.some((item) => item.id === updated.id);
      const base = exists
        ? prev.map((item) =>
            item.id === updated.id ? updated : { ...item },
          )
        : [...prev, updated];
      return updated.isPrimary
        ? base.map((item) =>
            item.id === updated.id ? item : { ...item, isPrimary: false },
          )
        : base;
    });
    closeForm();
    router.refresh();
  }

  const limitReached = localAddresses.length >= maxAddresses;

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
    setError(null);
  }

  function openEdit(address: SavedAddress) {
    setEditing(address);
    setFormOpen(true);
    setError(null);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  async function setPrimary(addressId: string) {
    setBusyId(addressId);
    setError(null);
    try {
      await apiRequest(`/api/customer/addresses/${addressId}`, {
        method: "PATCH",
        body: JSON.stringify({ isPrimary: true }),
      });
      router.refresh();
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setBusyId(null);
    }
  }

  async function remove(addressId: string) {
    setBusyId(addressId);
    setError(null);
    try {
      await apiRequest(`/api/customer/addresses/${addressId}`, {
        method: "DELETE",
      });
      setPendingDeleteId(null);
      router.refresh();
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <FormErrorAlert message={error} />

      {localAddresses.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Belum ada alamat tersimpan.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {localAddresses.map((address) => (
            <li
              key={address.id}
              className="flex flex-col gap-2 rounded-xl border border-border bg-background p-4 text-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{address.label}</span>
                {address.isPrimary ? <Badge variant="secondary">Utama</Badge> : null}
              </div>
              <p className="font-medium">{address.recipientName}</p>
              <p className="text-muted-foreground">{address.phone}</p>
              <p className="text-muted-foreground">{fullAddress(address)}</p>
              {address.note ? (
                <p className="text-xs text-muted-foreground">
                  Catatan: {address.note}
                </p>
              ) : null}

              {pendingDeleteId === address.id ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-destructive">
                    Hapus alamat ini?
                  </span>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={busyId === address.id}
                    onClick={() => remove(address.id)}
                  >
                    Ya, hapus
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPendingDeleteId(null)}
                  >
                    Batal
                  </Button>
                </div>
              ) : editing?.id === address.id ? null : (
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(address)}
                  >
                    Ubah
                  </Button>
                  {!address.isPrimary ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={busyId === address.id}
                      onClick={() => setPrimary(address.id)}
                    >
                      Jadikan Utama
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setPendingDeleteId(address.id)}
                  >
                    Hapus
                  </Button>
                </div>
              )}

              {/* Form ubah dirender inline di kartu alamat yang sedang
                  diubah â€” user tidak perlu scroll ke bawah halaman untuk
                  melihat form (form bawah khusus tambah alamat). */}
              {editing?.id === address.id ? (
                <AddressForm
                  key={address.id}
                  address={editing}
                  shippingConfigured={shippingConfigured}
                  onCancel={closeForm}
                  onSaved={applySaved}
                />
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {formOpen && !editing ? (
        <div ref={createFormRef} className="scroll-mt-24">
          <AddressForm
            key="new"
            address={null}
            shippingConfigured={shippingConfigured}
            onCancel={closeForm}
            onSaved={applySaved}
          />
        </div>
      ) : (
        <div className="flex flex-col items-start gap-1">
          <Button
            type="button"
            onClick={openCreate}
            disabled={limitReached}
            className="w-fit"
          >
            Tambah Alamat
          </Button>
          {limitReached ? (
            <p className="text-xs text-muted-foreground">
              Maksimal {maxAddresses} alamat tersimpan. Hapus salah satu untuk
              menambah.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

type AddressFormProps = {
  address: SavedAddress | null;
  shippingConfigured: boolean;
  onCancel: () => void;
  // Menerima data yang baru disimpan (lengkap, siap tampil) supaya manager
  // bisa menampilkannya optimis seketika â€” tanpa jeda "sudah disimpan tapi
  // daftar masih basi".
  onSaved: (saved: SavedAddress) => void | Promise<void>;
};

function AddressForm({
  address,
  shippingConfigured,
  onCancel,
  onSaved,
}: AddressFormProps) {
  const initialDestination: ShippingDestination | null =
    address?.destinationId && address.city
      ? {
          id: address.destinationId,
          label:
            [address.district, address.city].filter(Boolean).join(", ") ||
            address.city,
          provinceName: address.province,
          cityName: address.city,
          districtName: address.district ?? "",
          subdistrictName: address.subdistrict ?? "",
          zipCode: address.postalCode ?? "",
        }
      : null;

  const [label, setLabel] = useState(address?.label ?? "");
  const [recipientName, setRecipientName] = useState(
    address?.recipientName ?? "",
  );
  const [phone, setPhone] = useState(address?.phone ?? "");
  const [destination, setDestination] = useState<ShippingDestination | null>(
    initialDestination,
  );
  const [province, setProvince] = useState(address?.province ?? "");
  const [city, setCity] = useState(address?.city ?? "");
  const [district, setDistrict] = useState(address?.district ?? "");
  const [subdistrict, setSubdistrict] = useState(address?.subdistrict ?? "");
  const [postalCode, setPostalCode] = useState(address?.postalCode ?? "");
  const [street, setStreet] = useState(address?.street ?? "");
  const [note, setNote] = useState(address?.note ?? "");
  const [isPrimary, setIsPrimary] = useState(address?.isPrimary ?? false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const autoProvince = Boolean(destination?.provinceName);
  const autoCity = Boolean(destination?.cityName);
  const autoDistrict = Boolean(destination?.districtName);
  const autoSubdistrict = Boolean(destination?.subdistrictName);
  const autoPostal = Boolean(destination?.zipCode);
  const regionLocked = shippingConfigured && !destination;

  function handleDestination(value: ShippingDestination | null) {
    setDestination(value);
    if (!value) {
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
    setSubmitting(true);

    const payload = {
      label,
      recipientName,
      phone,
      destinationId: destination?.id,
      province,
      city,
      district: district || undefined,
      subdistrict: subdistrict || undefined,
      postalCode: postalCode || undefined,
      street,
      note: note || undefined,
      isPrimary,
    };

    try {
      // Bentuk data yang baru disimpan dari isi form; ID dari respons POST
      // untuk tambah (alamat lama sudah punya ID).
      const saved: SavedAddress = {
        id: address?.id ?? "",
        label,
        recipientName,
        phone,
        destinationId: destination?.id ?? null,
        province,
        city,
        district: district || null,
        subdistrict: subdistrict || null,
        postalCode: postalCode || null,
        street,
        note: note || null,
        isPrimary,
      };

      const savedId = address
        ? address.id
        : (
            await apiRequest<{ id: string }>("/api/customer/addresses", {
              method: "POST",
              body: JSON.stringify(payload),
            })
          ).id;

      if (!address) {
        await onSaved({ ...saved, id: savedId });
        return;
      }

      await apiRequest(`/api/customer/addresses/${address.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      await onSaved({ ...saved, id: savedId });
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4"
    >
      <h3 className="font-semibold">
        {address ? "Ubah Alamat" : "Tambah Alamat"}
      </h3>

      <FormErrorAlert message={error} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="address-label">Label</Label>
          <Input
            id="address-label"
            required
            autoFocus
            maxLength={50}
            placeholder="Contoh: Rumah"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="address-recipient">Nama penerima</Label>
          <Input
            id="address-recipient"
            required
            maxLength={100}
            value={recipientName}
            onChange={(event) => setRecipientName(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="address-phone">Nomor HP penerima</Label>
          <Input
            id="address-phone"
            required
            inputMode="tel"
            pattern="[0-9+()\-. ]*"
            title="Nomor HP hanya boleh berisi angka"
            placeholder="08123456789"
            value={phone}
            onChange={(event) =>
              setPhone(event.target.value.replace(PHONE_INPUT_FILTER, ""))
            }
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

        <div className="flex flex-col gap-2">
          <Label htmlFor="address-province">Provinsi</Label>
          <Input
            id="address-province"
            required
            disabled={regionLocked}
            readOnly={autoProvince}
            className={autoProvince ? "bg-muted" : undefined}
            value={province}
            onChange={(event) => setProvince(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="address-city">Kota/Kabupaten</Label>
          <Input
            id="address-city"
            required
            disabled={regionLocked}
            readOnly={autoCity}
            className={autoCity ? "bg-muted" : undefined}
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="address-district">Kecamatan</Label>
          <Input
            id="address-district"
            disabled={regionLocked}
            readOnly={autoDistrict}
            className={autoDistrict ? "bg-muted" : undefined}
            value={district}
            onChange={(event) => setDistrict(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="address-subdistrict">Kelurahan/Desa</Label>
          <Input
            id="address-subdistrict"
            disabled={regionLocked}
            readOnly={autoSubdistrict}
            className={autoSubdistrict ? "bg-muted" : undefined}
            value={subdistrict}
            onChange={(event) => setSubdistrict(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="address-postal">Kode pos</Label>
          <Input
            id="address-postal"
            required
            inputMode="numeric"
            pattern="[0-9]{5}"
            title="Kode pos harus 5 angka"
            maxLength={5}
            disabled={regionLocked}
            readOnly={autoPostal}
            className={autoPostal ? "bg-muted" : undefined}
            value={postalCode}
            onChange={(event) =>
              setPostalCode(event.target.value.replace(POSTAL_CODE_INPUT_FILTER, ""))
            }
          />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="address-street">Alamat lengkap</Label>
          <Textarea
            id="address-street"
            required
            rows={3}
            maxLength={500}
            placeholder="Jalan, nomor rumah, RT/RW"
            value={street}
            onChange={(event) => setStreet(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="address-note">Catatan (opsional)</Label>
          <Textarea
            id="address-note"
            rows={2}
            maxLength={500}
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={isPrimary}
          onChange={(event) => setIsPrimary(event.target.checked)}
        />
        Jadikan alamat utama
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Menyimpan..." : "Simpan Alamat"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
      </div>
    </form>
  );
}
