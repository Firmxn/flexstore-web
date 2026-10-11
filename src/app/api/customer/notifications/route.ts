import { requireCustomer } from "@/lib/auth/guard";
import { getNotificationFeed, markNotificationsSeen } from "@/lib/customers";
import { apiSuccess, forbidden, withRouteErrors } from "@/lib/utils/api";

// NOTIF-02 (PH-10): daftar notifikasi pesanan milik pemanggil + penanda belum
// dibaca. Isinya diturunkan di server dari data pesanan, tidak menerima input
// klien. Hanya customer; role lain ditolak (OWASP A01).

export async function GET() {
  return withRouteErrors(async () => {
    const guard = await requireCustomer();
    if (!guard.ok) return guard.response;
    if (guard.user.role !== "CUSTOMER") return forbidden();

    const feed = await getNotificationFeed(guard.user.id);
    return apiSuccess(feed);
  });
}

// Dipanggil klien saat dialog dibuka: semua entri dianggap sudah dibaca
// (satu penanda waktu, tanpa tabel per entri).
export async function POST() {
  return withRouteErrors(async () => {
    const guard = await requireCustomer();
    if (!guard.ok) return guard.response;
    if (guard.user.role !== "CUSTOMER") return forbidden();

    await markNotificationsSeen(guard.user.id);
    return apiSuccess({ ok: true });
  });
}
