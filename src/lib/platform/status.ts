import { getXenditSecretKey, getXenditWebhookToken } from "@/lib/payments/config";

// SITE-02/SITE-03 (PH-08): status keberadaan kunci rahasia. Hanya boolean yang
// pernah dikirim ke klien; nilai kuncinya tetap di env (OWASP A02).
export type PlatformSecretStatus = {
  xenditSecretKey: boolean;
  xenditWebhookToken: boolean;
  rajaongkirApiKey: boolean;
};

export function getPlatformSecretStatus(): PlatformSecretStatus {
  return {
    xenditSecretKey: getXenditSecretKey().length > 0,
    xenditWebhookToken: getXenditWebhookToken().length > 0,
    rajaongkirApiKey: Boolean(process.env.RAJAONGKIR_API_KEY?.trim()),
  };
}
