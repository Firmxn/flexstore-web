"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";

export function DeleteButton({
  url,
  confirmMessage,
  successRedirect,
  label = "Hapus",
}: {
  url: string;
  confirmMessage: string;
  successRedirect?: string;
  label?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleDelete() {
    if (!window.confirm(confirmMessage)) return;

    setError(null);
    setSubmitting(true);

    try {
      await apiRequest(url, { method: "DELETE" });

      if (successRedirect) router.push(successRedirect);
      router.refresh();
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        variant="ghost"
        size="sm"
        disabled={submitting}
        onClick={handleDelete}
        className="text-destructive hover:bg-destructive/10"
      >
        {submitting ? "Menghapus..." : label}
      </Button>
      {error ? (
        <Alert variant="destructive" className="max-w-64 py-1.5 text-xs">
          {error}
        </Alert>
      ) : null}
    </div>
  );
}
