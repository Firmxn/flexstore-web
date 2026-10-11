"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NotificationPreferencesForm } from "@/components/customer/NotificationPreferencesForm";
import type {
  AccountNotification,
  NotificationPreferences,
} from "@/lib/customers";
import { cn } from "@/lib/utils/cn";
import { formatDateTime } from "@/lib/utils/format";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";

// NOTIF-02 (PH-10): lonceng + dialog dua bagian (daftar notifikasi dan
// pengaturan preferensi email). Daftar diambil saat dialog dibuka, lalu penanda
// "sudah dibaca" disimpan di server sehingga badge hilang.

type Feed = {
  notifications: AccountNotification[];
  unreadCount: number;
};

type Section = "notifications" | "settings";

const tabClass = (active: boolean) =>
  cn(
    "rounded-md px-3 py-1.5 text-sm font-medium",
    active
      ? "bg-primary text-primary-foreground"
      : "text-muted-foreground hover:bg-accent hover:text-foreground",
  );

export function NotificationDialog({
  initialUnread,
  preferences,
}: {
  initialUnread: number;
  preferences: NotificationPreferences;
}) {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(initialUnread);
  const [section, setSection] = useState<Section>("notifications");
  const [feed, setFeed] = useState<AccountNotification[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) return;

    setError(null);
    setLoading(true);
    try {
      const result = await apiRequest<Feed>("/api/customer/notifications");
      setFeed(result.notifications);
      await apiRequest("/api/customer/notifications", { method: "POST" });
      setUnread(0);
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={
            unread > 0 ? `Notifikasi, ${unread} belum dibaca` : "Notifikasi"
          }
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-input hover:bg-accent"
        >
          <Bell className="h-4 w-4" aria-hidden />
          {unread > 0 ? (
            <Badge
              variant="destructive"
              className="absolute -right-1.5 -top-1.5 h-5 min-w-5 justify-center px-1 text-[10px]"
            >
              {unread > 99 ? "99+" : unread}
            </Badge>
          ) : null}
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notifikasi</DialogTitle>
          <DialogDescription>
            Aktivitas pesanan dan pengaturan email Anda.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className={tabClass(section === "notifications")}
            onClick={() => setSection("notifications")}
          >
            Notifikasi
          </button>
          <button
            type="button"
            className={tabClass(section === "settings")}
            onClick={() => setSection("settings")}
          >
            Pengaturan
          </button>
        </div>

        {section === "notifications" ? (
          <div className="flex flex-col gap-2">
            {loading ? (
              <p className="text-sm text-muted-foreground">Memuat...</p>
            ) : null}
            {error ? <Alert variant="destructive">{error}</Alert> : null}
            {!loading && !error && feed && feed.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Belum ada notifikasi.
              </p>
            ) : null}

            <ul className="flex flex-col gap-1">
              {feed?.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex flex-col gap-0.5 rounded-md p-3 hover:bg-accent"
                  >
                    <span className="text-sm font-medium">{item.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {formatDateTime(item.at)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Pilih email yang ingin Anda terima.
            </p>
            <NotificationPreferencesForm preferences={preferences} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
