import { TrackOrderForm } from "@/components/orders/TrackOrderForm";

export const metadata = { title: "Lacak Pesanan" };

export default function TrackOrderPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Lacak Pesanan</h1>
        <p className="text-sm text-muted-foreground">
          Masukkan nomor pesanan dan nomor HP yang dipakai saat checkout.
        </p>
      </div>
      <TrackOrderForm />
    </div>
  );
}
