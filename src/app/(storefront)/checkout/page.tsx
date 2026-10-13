import { redirect } from "next/navigation";
import { connection } from "next/server";
import { PageContainer } from "@/components/layout/PageContainer";
import { Alert } from "@/components/ui/alert";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { homeForRole } from "@/lib/auth/session";
import { BackLink } from "@/components/layout/BackLink";
import { getBrandSetting } from "@/lib/brand";
import { getCart, getCartAccess } from "@/lib/cart";
import { getPickupSettings } from "@/lib/config";
import { getAddresses, toSavedAddress, MAX_ADDRESSES, type SavedAddress } from "@/lib/customers";
import { prisma } from "@/lib/db/prisma";
import { getPlatformSettings } from "@/lib/platform";
import { isShippingApiConfigured } from "@/lib/shipping";

export const metadata = { title: "Checkout" };

// Membaca cookie/sesi + searchParams (item terpilih), jadi request-time.
// `instant = false` mengizinkan akses searchParams di luar Suspense.
export const instant = false;

type SearchParams = { variantIds?: string | string[] };

// Item terpilih dikirim dari /cart lewat query. Hanya ID yang dibawa; kuantitas
// dan harga tetap diambil server dari keranjang/varian.
function parseVariantIds(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const raw = Array.isArray(value) ? value.join(",") : value;
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await connection();

  const params = await searchParams;
  const variantIds = parseVariantIds(params.variantIds);

  // Checkout hanya untuk customer dan guest; role lain (mis. admin)
  // diarahkan ke areanya masing-masing (PRD 2).
  const access = await getCartAccess();
  if (!access.ok) redirect(homeForRole(access.role));
  const identity = access.identity;
  if (!identity || variantIds.length === 0) redirect("/cart");

  const cart = await getCart(identity);
  const wanted = new Set(variantIds);
  const items = cart.items.filter((item) => wanted.has(item.variantId));
  if (items.length === 0) redirect("/cart");

  const mode = identity.kind === "user" ? "user" : "guest";

  let defaults = { name: "", email: "", phone: "" };
  let savedAddresses: SavedAddress[] = [];
  if (identity.kind === "user") {
    const [account, addresses] = await Promise.all([
      prisma.user.findUnique({
        where: { id: identity.userId },
        select: { name: true, email: true, phone: true },
      }),
      getAddresses(identity.userId),
    ]);
    defaults = {
      name: account?.name ?? "",
      email: account?.email ?? "",
      phone: account?.phone ?? "",
    };
    savedAddresses = addresses.map(toSavedAddress);
  }

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const [pickup, platform, brand] = await Promise.all([
    getPickupSettings(),
    getPlatformSettings(),
    getBrandSetting(),
  ]);

  return (
    <PageContainer>
      <BackLink href="/cart">Kembali ke keranjang</BackLink>

      <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>

      {platform.maintenanceMode ? (
        <Alert variant="destructive">
          {platform.maintenanceMessage?.trim() ||
            "Toko sedang dalam pemeliharaan. Pemesanan baru sementara ditutup."}
        </Alert>
      ) : null}

      {!platform.paymentEnabled ? (
        <Alert variant="destructive">
          Pembayaran sedang dimatikan. Pesanan bisa dibuat, tetapi pembayaran
          belum tersedia.
        </Alert>
      ) : null}

      <CheckoutForm
        mode={mode}
        items={items}
        subtotal={subtotal}
        shippingConfigured={await isShippingApiConfigured()}
        defaults={defaults}
        savedAddresses={savedAddresses}
        addressSaveEnabled={savedAddresses.length < MAX_ADDRESSES}
        pickup={{
          enabled: pickup.enabled,
          info: pickup.info,
          brandName: brand.brandName,
          storeAddress: pickup.storeAddress,
          storePhone: pickup.storePhone,
        }}
      />
    </PageContainer>
  );
}
