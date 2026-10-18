import { getPlatformSettings } from "@/lib/platform";

// SITE-01 (PH-08): banner mode pemeliharaan di storefront. Dipisah sebagai
// Server Component sendiri supaya layout tetap statis dan bagian dinamis
// di-stream di dalam Suspense boundary (pola sama seperti HeaderUserMenu).
export async function MaintenanceBanner() {
  const settings = await getPlatformSettings();
  if (!settings.maintenanceMode) return null;

  return (
    <div
      role="status"
      className="border-b border-warning/20 bg-warning/10 px-4 py-2 text-center text-sm text-warning-strong"
    >
      {settings.maintenanceMessage?.trim() ||
        "Toko sedang dalam pemeliharaan. Pemesanan baru sementara ditutup."}
    </div>
  );
}
