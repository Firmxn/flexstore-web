import { getBrandSetting } from "@/lib/brand";
import { getEmailFrom, getResendApiKey } from "./config";

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

export type SendEmailResult =
  | { ok: true }
  | { ok: false; reason: "NOT_CONFIGURED" | "PROVIDER_ERROR" };

const RESEND_ENDPOINT = "https://api.resend.com/emails";

// Pengiriman email lewat Resend. Tidak pernah melempar error: kegagalan hanya
// dicatat di log server (OWASP A09) dan alur pemanggil tetap berjalan.
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = getResendApiKey();
  if (!apiKey) return { ok: false, reason: "NOT_CONFIGURED" };

  // SITE-05 (PH-09): nama pengirim mengikuti identitas brand.
  const brand = await getBrandSetting();

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: getEmailFrom(brand.brandName),
        to: [input.to],
        subject: input.subject,
        html: input.html,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(
        `[notifications] Resend menolak (${response.status}): ${detail}`,
      );
      return { ok: false, reason: "PROVIDER_ERROR" };
    }

    return { ok: true };
  } catch (error) {
    console.error("[notifications] Resend gagal dihubungi", error);
    return { ok: false, reason: "PROVIDER_ERROR" };
  }
}
