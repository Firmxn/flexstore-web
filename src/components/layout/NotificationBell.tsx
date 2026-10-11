import { connection } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import {
  countUnreadNotifications,
  getNotificationPreferences,
} from "@/lib/customers";
import { NotificationDialog } from "./NotificationDialog";

// NOTIF-02 (PH-10): ikon lonceng hanya tampil untuk customer login. Jumlah belum
// dibaca dihitung per request (pola CartBadge) sehingga pembaruan mengikuti
// reload halaman, tanpa polling.
export async function NotificationBell() {
  await connection();

  const user = await getCurrentUser();
  if (!user || user.role !== "CUSTOMER") return null;

  const [unreadCount, preferences] = await Promise.all([
    countUnreadNotifications(user.id),
    getNotificationPreferences(user.id),
  ]);

  return (
    <NotificationDialog initialUnread={unreadCount} preferences={preferences} />
  );
}
