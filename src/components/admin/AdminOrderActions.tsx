"use client";

import { useState } from "react";
import type { OrderStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUploadThing } from "@/lib/uploadthing/client";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";
import { FormErrorAlert } from "@/components/ui/form-error-alert";

// Aksi admin atas satu pesanan (ORDER-05/06/07): kirim, selesaikan, tinjau
// pembatalan, dan selesaikan refund dengan bukti. Semua permintaan menuju
// `/api/admin/orders/[id]` dengan discriminated union.

export type AdminRefundItem = {
  id: string;
  status: string;
  amount: number;
};

type Props = {
  orderId: string;
  status: OrderStatus;
  cancellationReasons: { id: string; text: string }[];
  refunds: AdminRefundItem[];
};

function RefundCompleteForm({
  orderId,
  refundId,
}: {
  orderId: string;
  refundId: string;
}) {
  const router = useRouter();
  const [proofUrl, setProofUrl] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { startUpload, isUploading } = useUploadThing("refundProof", {
    onClientUploadComplete: (files) => {
      const url = files[0]?.serverData.url;
      if (url) {
        setProofUrl(url);
        setError(null);
      }
    },
    onUploadError: () => setError("Gagal mengunggah bukti refund"),
  });

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    await startUpload([file]);
  }

  async function handleSubmit() {
    setError(null);
    if (!proofUrl) {
      setError("Unggah bukti refund terlebih dahulu");
      return;
    }
    setSubmitting(true);
    try {
      await apiRequest(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        body: JSON.stringify({
          action: "COMPLETE_REFUND",
          refundId,
          proofUrl,
          note: note.trim() === "" ? undefined : note.trim(),
        }),
      });
      router.refresh();
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-3">
      <div className="flex flex-col gap-2">
        <Label htmlFor={`refund-proof-${refundId}`}>Bukti refund (gambar)</Label>
        <input
          id={`refund-proof-${refundId}`}
          type="file"
          accept="image/*"
          className="text-sm"
          onChange={handleFile}
        />
        {isUploading ? (
          <p className="text-xs text-muted-foreground">Mengunggah...</p>
        ) : null}
        {proofUrl ? (
          <p className="text-xs text-muted-foreground">Bukti terunggah.</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`refund-note-${refundId}`}>Catatan (opsional)</Label>
        <Input
          id={`refund-note-${refundId}`}
          value={note}
          maxLength={500}
          onChange={(event) => setNote(event.target.value)}
        />
      </div>
      <FormErrorAlert message={error} />
      <Button
        type="button"
        disabled={submitting || isUploading}
        onClick={handleSubmit}
        className="self-start"
      >
        {submitting ? "Menyimpan..." : "Tandai Refund Selesai"}
      </Button>
    </div>
  );
}

export function AdminOrderActions({
  orderId,
  status,
  cancellationReasons,
  refunds,
}: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [rejectMode, setRejectMode] = useState<"template" | "manual">("template");
  const [rejectTemplate, setRejectTemplate] = useState(
    cancellationReasons[0]?.text ?? "",
  );
  const [rejectManual, setRejectManual] = useState("");

  async function run(body: Record<string, unknown>) {
    setError(null);
    setBusy(true);
    try {
      await apiRequest(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      router.refresh();
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  const pendingRefunds = refunds.filter((refund) => refund.status === "PENDING");

  return (
    <div className="flex flex-col gap-4">
      <FormErrorAlert message={error} />

      {status === "PROCESSING" ? (
        <form
          className="flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            void run({ action: "SHIP", trackingNumber });
          }}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="tracking-number">Nomor resi</Label>
            <Input
              id="tracking-number"
              required
              minLength={3}
              maxLength={50}
              value={trackingNumber}
              onChange={(event) => setTrackingNumber(event.target.value)}
            />
          </div>
          <Button type="submit" disabled={busy} className="self-start">
            {busy ? "Memproses..." : "Tandai Dikirim"}
          </Button>
        </form>
      ) : null}

      {status === "SHIPPED" ? (
        <Button
          type="button"
          disabled={busy}
          onClick={() => void run({ action: "COMPLETE" })}
          className="self-start"
        >
          {busy ? "Memproses..." : "Tandai Selesai"}
        </Button>
      ) : null}

      {status === "CANCEL_REQUESTED" ? (
        <div className="flex flex-col gap-4">
          <Button
            type="button"
            disabled={busy}
            onClick={() => void run({ action: "APPROVE_CANCEL" })}
            className="self-start"
          >
            {busy ? "Memproses..." : "Setujui Pembatalan"}
          </Button>

          <form
            className="flex flex-col gap-3 rounded-lg border border-border p-3"
            onSubmit={(event) => {
              event.preventDefault();
              void run({
                action: "REJECT_CANCEL",
                rejectionReason:
                  rejectMode === "template" ? rejectTemplate : rejectManual,
              });
            }}
          >
            <h3 className="text-sm font-semibold">Tolak Pembatalan</h3>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reject-mode">Sumber alasan</Label>
              <Select
                value={rejectMode}
                onValueChange={(value) =>
                  setRejectMode(value as "template" | "manual")
                }
              >
                <SelectTrigger id="reject-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="template">Pilih template</SelectItem>
                  <SelectItem value="manual">Isi manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {rejectMode === "template" ? (
              cancellationReasons.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Belum ada template alasan. Tambahkan di menu Template Alasan.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="reject-template">Template alasan</Label>
                  <Select
                    value={rejectTemplate}
                    onValueChange={setRejectTemplate}
                  >
                    <SelectTrigger id="reject-template">
                      <SelectValue placeholder="Pilih template alasan" />
                    </SelectTrigger>
                    <SelectContent>
                      {cancellationReasons.map((reason) => (
                        <SelectItem key={reason.id} value={reason.text}>
                          {reason.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )
            ) : (
              <div className="flex flex-col gap-2">
                <Label htmlFor="reject-manual">Alasan penolakan</Label>
                <Input
                  id="reject-manual"
                  required
                  minLength={3}
                  maxLength={300}
                  value={rejectManual}
                  onChange={(event) => setRejectManual(event.target.value)}
                />
              </div>
            )}

            <Button
              type="submit"
              variant="outline"
              disabled={busy}
              className="self-start"
            >
              {busy ? "Memproses..." : "Tolak Pembatalan"}
            </Button>
          </form>
        </div>
      ) : null}

      {pendingRefunds.length > 0 ? (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">Refund Menunggu Bukti</h3>
          {pendingRefunds.map((refund) => (
            <RefundCompleteForm
              key={refund.id}
              orderId={orderId}
              refundId={refund.id}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
