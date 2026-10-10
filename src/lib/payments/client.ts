import { XENDIT_BASE_URL, getXenditSecretKey } from "./config";

// Klien tipis untuk Xendit Invoice API v2. Hanya endpoint yang dipakai PH-04.
export type XenditInvoice = {
  id: string;
  externalId: string;
  invoiceUrl: string;
  status: string;
  amount: number;
  expiryDate: string | null;
  paidAt: string | null;
};

export type CreateInvoiceInput = {
  externalId: string;
  amount: number;
  description: string;
  durationSeconds: number;
  payerEmail?: string | null;
  successRedirectUrl?: string | null;
  failureRedirectUrl?: string | null;
};

type XenditInvoiceResponse = {
  id?: string;
  external_id?: string;
  invoice_url?: string;
  status?: string;
  amount?: number;
  expiry_date?: string;
  paid_at?: string;
};

// Basic Auth: secret key sebagai username, password kosong (Xendit API keys).
function authorizationHeader(): string {
  const secretKey = getXenditSecretKey();
  if (!secretKey) {
    throw new Error("XENDIT_SECRET_KEY belum diisi di .env.local");
  }
  return `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`;
}

export async function createInvoice(
  input: CreateInvoiceInput,
): Promise<XenditInvoice> {
  const body: Record<string, unknown> = {
    external_id: input.externalId,
    amount: Math.round(input.amount),
    description: input.description,
    currency: "IDR",
    invoice_duration: input.durationSeconds,
  };
  if (input.payerEmail) body.payer_email = input.payerEmail;
  if (input.successRedirectUrl) {
    body.success_redirect_url = input.successRedirectUrl;
  }
  if (input.failureRedirectUrl) {
    body.failure_redirect_url = input.failureRedirectUrl;
  }

  const response = await fetch(`${XENDIT_BASE_URL}/v2/invoices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authorizationHeader(),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    // Detail hanya ke log; pemanggil menerima pesan generik (OWASP A09).
    const detail = await response.text().catch(() => "");
    console.error("[xendit] gagal membuat invoice", {
      status: response.status,
      detail,
    });
    throw new Error(`Xendit create invoice gagal (${response.status})`);
  }

  const data = (await response.json()) as XenditInvoiceResponse;
  if (!data.id || !data.invoice_url) {
    throw new Error("Xendit create invoice: respons tidak lengkap");
  }

  return {
    id: data.id,
    externalId: data.external_id ?? input.externalId,
    invoiceUrl: data.invoice_url,
    status: data.status ?? "PENDING",
    amount: data.amount ?? input.amount,
    expiryDate: data.expiry_date ?? null,
    paidAt: data.paid_at ?? null,
  };
}

// Ambil status invoice terkini langsung dari Xendit. Dipakai untuk
// rekonsiliasi ketika webhook belum/tidak sampai (mis. dev tanpa URL publik).
export async function getInvoice(invoiceId: string): Promise<XenditInvoice> {
  const response = await fetch(
    `${XENDIT_BASE_URL}/v2/invoices/${encodeURIComponent(invoiceId)}`,
    {
      method: "GET",
      headers: { Authorization: authorizationHeader() },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("[xendit] gagal mengambil invoice", {
      status: response.status,
      detail,
    });
    throw new Error(`Xendit get invoice gagal (${response.status})`);
  }

  const data = (await response.json()) as XenditInvoiceResponse;
  return {
    id: data.id ?? invoiceId,
    externalId: data.external_id ?? "",
    invoiceUrl: data.invoice_url ?? "",
    status: data.status ?? "PENDING",
    amount: data.amount ?? 0,
    expiryDate: data.expiry_date ?? null,
    paidAt: data.paid_at ?? null,
  };
}
