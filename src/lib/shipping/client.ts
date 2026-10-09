// Wrapper RajaOngkir (Komerce Shipping Cost API v1).
// Dokumentasi: https://rajaongkir.com/docs (search destination + calculate
// domestic cost). Base URL ditulis tetap di sini, tidak diambil dari input
// pengguna (OWASP A10 SSRF).
const RAJAONGKIR_BASE_URL = "https://rajaongkir.komerce.id";
const REQUEST_TIMEOUT_MS = 10_000; // SDD section 9: Shipping API timeout 10s

type RajaMeta = { code?: number; status?: string; message?: string };

async function rajaFetch(
  path: string,
  init: RequestInit,
  apiKey: string,
): Promise<unknown> {
  const response = await fetch(`${RAJAONGKIR_BASE_URL}${path}`, {
    ...init,
    headers: { key: apiKey, ...init.headers },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`RajaOngkir menjawab ${response.status}`);
  }

  const payload = (await response.json()) as { meta?: RajaMeta };
  if (payload.meta?.code !== 200) {
    throw new Error(`RajaOngkir meta ${payload.meta?.code}: ${payload.meta?.message ?? "-"}`);
  }
  return payload;
}

export type ShippingDestination = {
  id: string;
  label: string;
};

type DestinationRow = { id?: number | string; label?: string };

export async function searchDestinations(
  apiKey: string,
  search: string,
): Promise<ShippingDestination[]> {
  const params = new URLSearchParams({ search, limit: "10", offset: "0" });
  const payload = (await rajaFetch(
    `/api/v1/destination/domestic-destination?${params.toString()}`,
    { method: "GET" },
    apiKey,
  )) as { data?: DestinationRow[] };

  return (payload.data ?? [])
    .filter((row) => row.id != null && typeof row.label === "string")
    .map((row) => ({ id: String(row.id), label: row.label as string }));
}

export type RajaCostOption = {
  courier: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
};

type CostRow = {
  name?: string;
  code?: string;
  service?: string;
  description?: string;
  cost?: number;
  etd?: string;
};

export async function calculateDomesticCost(
  apiKey: string,
  input: {
    origin: string;
    destination: string;
    weightGram: number;
    couriers: string;
  },
): Promise<RajaCostOption[]> {
  const body = new URLSearchParams({
    origin: input.origin,
    destination: input.destination,
    weight: String(input.weightGram),
    courier: input.couriers,
    price: "lowest",
  });

  // Alur kita memakai pencarian langsung (destination/domestic-destination),
  // yang mengembalikan ID tingkat kecamatan/subdistrict. Endpoint district
  // (`/calculate/district/domestic-cost`) hanya menerima ID tingkat district
  // dari kaskade provinsi/kota/district, jadi yang dipakai adalah
  // `/calculate/domestic-cost` (menerima ID dari hasil pencarian).
  const payload = (await rajaFetch(
    "/api/v1/calculate/domestic-cost",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    },
    apiKey,
  )) as { data?: CostRow[] };

  return (payload.data ?? [])
    .filter((row) => typeof row.cost === "number" && row.service)
    .map((row) => ({
      courier: row.name ?? row.code ?? "",
      code: row.code ?? "",
      service: row.service ?? "",
      description: row.description ?? "",
      cost: Number(row.cost),
      etd: row.etd || "-",
    }));
}
