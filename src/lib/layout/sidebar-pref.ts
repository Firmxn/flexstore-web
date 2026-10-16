// Preferensi tampilan sidebar admin. Modul netral (tanpa direktif
// "use client") supaya bisa dipakai layout server dan shell client
// tanpa melanggar batas server/client boundary.
export const SIDEBAR_PREF_COOKIE = "flexstore_admin_sidebar";

export function isSidebarCollapsed(value: string | undefined): boolean {
  return value === "collapsed";
}
