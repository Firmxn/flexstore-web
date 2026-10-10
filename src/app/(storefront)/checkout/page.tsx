import { redirect } from "next/navigation";
import { connection } from "next/server";
import { PageContainer } from "@/components/layout/PageContainer";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { getCart, getCartAccess } from "@/lib/cart";
import { prisma } from "@/lib/db/prisma";
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
  // diarahkan ke area admin (PRD 2).
  const access = await getCartAccess();
  if (!access.ok) redirect("/admin");
  const identity = access.identity;
  if (!identity || variantIds.length === 0) redirect("/cart");

  const cart = await getCart(identity);
  const wanted = new Set(variantIds);
  const items = cart.items.filter((item) => wanted.has(item.variantId));
  if (items.length === 0) redirect("/cart");

  const mode = identity.kind === "user" ? "user" : "guest";

  let defaults = { name: "", email: "", phone: "" };
  if (identity.kind === "user") {
    const account = await prisma.user.findUnique({
      where: { id: identity.userId },
      select: { name: true, email: true, phone: true },
    });
    defaults = {
      name: account?.name ?? "",
      email: account?.email ?? "",
      phone: account?.phone ?? "",
    };
  }

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
      <CheckoutForm
        mode={mode}
        items={items}
        subtotal={subtotal}
        shippingConfigured={isShippingApiConfigured()}
        defaults={defaults}
      />
    </PageContainer>
  );
}
