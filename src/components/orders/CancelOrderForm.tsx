"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";
import { FormErrorAlert } from "@/components/ui/form-error-alert";

// ORDER-05 (PH-06): pengajuan pembatalan oleh pembeli (PRD 5.5). Hanya seluruh
// pesanan, dan hanya selama belum dikirim.
export function CancelOrderForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await apiRequest(`/api/orders/${orderId}/cancel`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      });
      router.refresh();
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
// SITE-07 (TASK-124): tombol batal memakai token destructive (tint 10/20),
// menggantikan keluarga red-* hardcode agar mengikuti palet brand.
      <Button type="button" variant="outline" size="sm" className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 hover:text-destructive" onClick={() => setOpen(true)}>
        Ajukan Pembatalan
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <Label htmlFor="cancel-reason">Alasan pembatalan</Label>
        <Textarea
          id="cancel-reason"
          required
          rows={2}
          minLength={3}
          maxLength={300}
          placeholder="Contoh: salah pilih ukuran"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      </div>
      <FormErrorAlert message={error} />
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Mengirim..." : "Kirim Pengajuan"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(false)}
          disabled={submitting}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
