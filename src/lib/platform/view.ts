import { getPlatformSecretStatus } from "./status";
import type { PlatformSettings } from "./queries";

// Bentuk respons API area platform: nilai konfigurasi (bukan rahasia) plus
// status keberadaan kunci. Nilai kunci tidak pernah ikut (OWASP A02).
export type PlatformSettingsView = PlatformSettings & {
  secrets: ReturnType<typeof getPlatformSecretStatus>;
};

export function toPlatformSettingsView(
  settings: PlatformSettings,
): PlatformSettingsView {
  return { ...settings, secrets: getPlatformSecretStatus() };
}
