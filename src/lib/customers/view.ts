import type { Address } from "@prisma/client";

// Bentuk alamat yang aman dikirim ke Client Component (tanpa Date/Decimal) dan
// dipakai bersama oleh halaman /profile dan pemilih alamat di /checkout.
export type SavedAddress = {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  destinationId: string | null;
  province: string;
  city: string;
  district: string | null;
  subdistrict: string | null;
  postalCode: string | null;
  street: string;
  note: string | null;
  isPrimary: boolean;
};

export function toSavedAddress(row: Address): SavedAddress {
  return {
    id: row.id,
    label: row.label,
    recipientName: row.recipientName,
    phone: row.phone,
    destinationId: row.destinationId,
    province: row.province,
    city: row.city,
    district: row.district,
    subdistrict: row.subdistrict,
    postalCode: row.postalCode,
    street: row.street,
    note: row.note,
    isPrimary: row.isPrimary,
  };
}
