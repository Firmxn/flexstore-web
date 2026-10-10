import { getCart, getCartAccess } from "@/lib/cart";
import {
  calculateShippingQuote,
  getShippingSettings,
  isShippingApiConfigured,
} from "@/lib/shipping";
import { shippingCalculateSchema } from "@/lib/shipping/validation";
import {
  apiError,
  apiSuccess,
  forbidden,
  validationError,
  withRouteErrors,
} from "@/lib/utils/api";

// Berat paket dihitung di server dari isi keranjang (total kuantitas x berat
// per item), tidak dipercaya dari input klien.
export async function POST(request: Request) {
  return withRouteErrors(async () => {
    const access = await getCartAccess();
    if (!access.ok) return forbidden();
    const identity = access.identity;

    const body = await request.json().catch(() => null);
    const parsed = shippingCalculateSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const configured = isShippingApiConfigured();

    if (!identity) {
      return apiError("CART_EMPTY", "Keranjang kosong", 400);
    }

    const cart = await getCart(identity);
    if (cart.items.length === 0) {
      return apiError("CART_EMPTY", "Keranjang kosong", 400);
    }

    // Hanya item terpilih yang dihitung (checkbox di /cart). Kuantitas tetap
    // berasal dari keranjang; daftar ID dari klien hanya menyaring.
    const selectedIds = parsed.data.variantIds;
    const items =
      selectedIds && selectedIds.length > 0
        ? cart.items.filter((item) => selectedIds.includes(item.variantId))
        : cart.items;
    if (items.length === 0) {
      return apiError("CART_EMPTY", "Tidak ada item terpilih", 400);
    }

    // Tujuan hanya wajib kalau API ongkir aktif; tanpa API key tarif flat dipakai.
    if (configured && !parsed.data.destinationId) {
      return apiError("VALIDATION_ERROR", "Tujuan wajib dipilih", 400, "destinationId");
    }

    const settings = getShippingSettings();

    // Berat paket = jumlah (kuantitas x berat varian). Berat varian berasal dari
    // data produk yang diisi admin, bukan dari body request. Env hanya dipakai
    // sebagai cadangan untuk varian yang beratnya 0/belum diisi.
    const fallbackGram = settings.weightPerItemGram;
    const weightGram = items.reduce(
      (total, item) =>
        total +
        item.quantity * (item.weightGram > 0 ? item.weightGram : fallbackGram),
      0,
    );

    const quote = await calculateShippingQuote(
      parsed.data.destinationId ?? "",
      weightGram,
    );
    return apiSuccess(quote);
  });
}
