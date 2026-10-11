"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cancellationReasonSchema } from "@/lib/config";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";

// CONFIG-01 (PH-06): kelola template alasan penolakan pembatalan (PRD 5.5).

export type CancellationReasonRow = {
  id: string;
  text: string;
  isActive: boolean;
  sortOrder: number;
};

export function CancellationReasonManager({
  reasons,
}: {
  reasons: CancellationReasonRow[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [newText, setNewText] = useState("");

  async function send(url: string, method: string, body?: unknown) {
    setError(null);
    setBusy(true);
    try {
      await apiRequest(url, {
        method,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      router.refresh();
      return true;
    } catch (caught) {
      setError(toErrorMessage(caught));
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = cancellationReasonSchema.safeParse({
      text: newText,
      isActive: true,
      sortOrder: 0,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Data tidak valid");
      return;
    }
    if (await send("/api/admin/cancellation-reasons", "POST", parsed.data)) {
      setNewText("");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {error ? <Alert variant="destructive">{error}</Alert> : null}

      <form
        onSubmit={handleAdd}
        className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-end"
      >
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor="new-reason" className="text-sm font-medium">
            Template baru
          </label>
          <Input
            id="new-reason"
            required
            minLength={3}
            maxLength={300}
            placeholder="Contoh: Pesanan sudah dikirim"
            value={newText}
            onChange={(event) => setNewText(event.target.value)}
          />
        </div>
        <Button type="submit" disabled={busy}>
          {busy ? "Menyimpan..." : "Tambah"}
        </Button>
      </form>

      {reasons.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-background p-12 text-center text-sm text-muted-foreground">
          Belum ada template alasan.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {reasons.map((reason) => (
            <ReasonRow
              key={reason.id}
              reason={reason}
              busy={busy}
              onSave={(data) =>
                send(`/api/admin/cancellation-reasons/${reason.id}`, "PATCH", data)
              }
              onDelete={() =>
                send(`/api/admin/cancellation-reasons/${reason.id}`, "DELETE")
              }
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function ReasonRow({
  reason,
  busy,
  onSave,
  onDelete,
}: {
  reason: CancellationReasonRow;
  busy: boolean;
  onSave: (data: {
    text: string;
    isActive: boolean;
    sortOrder: number;
  }) => Promise<boolean>;
  onDelete: () => Promise<boolean>;
}) {
  const [text, setText] = useState(reason.text);
  const [sortOrder, setSortOrder] = useState(String(reason.sortOrder));
  const [isActive, setIsActive] = useState(reason.isActive);
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSave() {
    const parsed = cancellationReasonSchema.safeParse({
      text,
      isActive,
      sortOrder: sortOrder.trim() === "" ? 0 : Number(sortOrder),
    });
    if (!parsed.success) {
      setLocalError(parsed.error.issues[0]?.message ?? "Data tidak valid");
      return;
    }
    setLocalError(null);
    await onSave(parsed.data);
  }

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={text}
          maxLength={300}
          onChange={(event) => setText(event.target.value)}
          className="flex-1"
        />
        <Input
          type="number"
          min="0"
          max="999"
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
          className="sm:w-24"
          aria-label="Urutan"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-input"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
          />
          Aktif
        </label>
        <div className="flex items-center gap-2">
          <Button type="button" disabled={busy} onClick={handleSave}>
            Simpan
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={busy}
            onClick={() => void onDelete()}
            className="text-destructive hover:bg-destructive/10"
          >
            Hapus
          </Button>
        </div>
      </div>
      {localError ? <Alert variant="destructive">{localError}</Alert> : null}
    </li>
  );
}
