import { redis } from "@/lib/redis/client";
import {
  calculateDomesticCost,
  searchDestinations,
  type RajaCostOption,
  type ShippingDestination,
} from "./client";

// Keputusan PH-02 (dicatat di docs/04 section 10):
// - Skema produk belum punya berat, jadi berat paket = total kuantitas x
//   berat per item (default 1000 gram, bisa dioverride lewat env).
// - Tanpa API key / saat API gagal: fallback tarif flat Rp10.000 (SDD section 9).
export const DEFAULT_WEIGHT_PER_ITEM_GRAM = 1000;
export const FLAT_RATE_IDR = 10_000;
const DEFAULT_COURIERS = "jne:sicepat:jnt";

const COST_CACHE_TTL_SECONDS = 10 * 60; // SDD section 9: cache 5-10 menit
// Data destinasi (provinsi/kota/kecamatan/kelurahan) praktis statis, jadi
// dicache lama supaya pencarian berulang tidak menghabiskan kuota RajaOngkir.
const SEARCH_CACHE_TTL_SECONDS = 24 * 60 * 60;
// Kalau provider gagal (mis. kuota habis), tandai singkat supaya request
// berikutnya tidak ikut menunggu API yang lambat.
const SEARCH_ERROR_CACHE_TTL_SECONDS = 60;
const SEARCH_ERROR_KEY = "ship:search:error";

export type ShippingSettings = {
  apiKey: string;
  originDistrictId: string;
  weightPerItemGram: number;
  couriers: string;
};

export function getShippingSettings(): ShippingSettings {
  return {
    apiKey: process.env.RAJAONGKIR_API_KEY?.trim() ?? "",
    originDistrictId: process.env.SHIPPING_ORIGIN_DISTRICT_ID?.trim() ?? "",
    weightPerItemGram:
      Number(process.env.SHIPPING_WEIGHT_PER_ITEM_GRAM) ||
      DEFAULT_WEIGHT_PER_ITEM_GRAM,
    couriers: process.env.SHIPPING_COURIERS?.trim() || DEFAULT_COURIERS,
  };
}

export function isShippingApiConfigured(): boolean {
  const settings = getShippingSettings();
  return Boolean(settings.apiKey && settings.originDistrictId);
}

export type ShippingOption = RajaCostOption;
// Berat paket sengaja TIDAK ada di bentuk respons: customer/guest tidak boleh
// melihatnya. Berat tetap dipakai server sebagai bagian kunci cache.
export type ShippingQuote = {
  source: "api" | "fallback";
  cached: boolean;
  options: ShippingOption[];
};

const flatRateOption = (): ShippingOption => ({
  courier: "FLAT",
  code: "flat",
  service: "REGULER",
  description: "Tarif flat sementara",
  cost: FLAT_RATE_IDR,
  etd: "-",
});

const costCacheKey = (origin: string, destination: string, weightGram: number) =>
  `ship:cost:${origin}:${destination}:${weightGram}`;

// Versi v2: ShippingDestination bertambah field (kota/provinsi/kode pos), jadi
// entri cache lama tidak dipakai lagi.
const searchCacheKey = (search: string) =>
  `ship:search:v2:${search.trim().toLowerCase()}`;

// Redis gagal tidak boleh mematikan fitur (SDD section 9: degrade gracefully),
// jadi cache dibungkus try/catch dan proses lanjut tanpa cache.
async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    return await redis.get<T>(key);
  } catch {
    return null;
  }
}

async function cacheSet(key: string, value: unknown, ttl: number): Promise<void> {
  try {
    await redis.set(key, value, { ex: ttl });
  } catch {
    // abaikan; cache opsional
  }
}

export async function calculateShippingQuote(
  destinationId: string,
  weightGram: number,
): Promise<ShippingQuote> {
  const settings = getShippingSettings();

  if (!settings.apiKey || !settings.originDistrictId) {
    return {
      source: "fallback",
      cached: false,
      options: [flatRateOption()],
    };
  }

  const cacheKey = costCacheKey(
    settings.originDistrictId,
    destinationId,
    weightGram,
  );
  const cached = await cacheGet<ShippingOption[]>(cacheKey);
  if (Array.isArray(cached) && cached.length > 0) {
    return { source: "api", cached: true, options: cached };
  }

  try {
    const options = await calculateDomesticCost(settings.apiKey, {
      origin: settings.originDistrictId,
      destination: destinationId,
      weightGram,
      couriers: settings.couriers,
    });

    if (options.length === 0) {
      return {
        source: "fallback",
        cached: false,
        options: [flatRateOption()],
      };
    }

    await cacheSet(cacheKey, options, COST_CACHE_TTL_SECONDS);
    return { source: "api", cached: false, options };
  } catch (error) {
    console.error("[shipping] kalkulasi gagal, pakai tarif flat", error);
    return {
      source: "fallback",
      cached: false,
      options: [flatRateOption()],
    };
  }
}

export async function searchShippingDestinations(
  search: string,
): Promise<{ configured: boolean; cities: ShippingDestination[] }> {
  const settings = getShippingSettings();
  if (!settings.apiKey) {
    return { configured: false, cities: [] };
  }

  const cacheKey = searchCacheKey(search);
  const cached = await cacheGet<ShippingDestination[]>(cacheKey);
  if (Array.isArray(cached)) {
    return { configured: true, cities: cached };
  }

  // Kalau provider baru saja gagal (mis. kuota RajaOngkir habis), jangan
  // menghajar API yang lambat lagi untuk sementara waktu.
  const providerDown = await cacheGet<boolean>(SEARCH_ERROR_KEY);
  if (providerDown) {
    return { configured: true, cities: [] };
  }

  try {
    const cities = await searchDestinations(settings.apiKey, search);
    await cacheSet(cacheKey, cities, SEARCH_CACHE_TTL_SECONDS);
    return { configured: true, cities };
  } catch (error) {
    console.error("[shipping] pencarian tujuan gagal", error);
    await cacheSet(SEARCH_ERROR_KEY, true, SEARCH_ERROR_CACHE_TTL_SECONDS);
    return { configured: true, cities: [] };
  }
}
