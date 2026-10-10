// Tipe bersama pemilih ongkir. Dipisah dari komponen supaya DestinationPicker
// dan CourierPicker bisa berbagi tanpa impor melingkar.

export type ShippingOption = {
  courier: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
};

// Field kota/provinsi/kode pos datang dari RajaOngkir (lihat
// src/lib/shipping/client.ts) dan dipakai untuk mengisi alamat otomatis.
export type ShippingDestination = {
  id: string;
  label: string;
  provinceName: string;
  cityName: string;
  districtName: string;
  subdistrictName: string;
  zipCode: string;
};
