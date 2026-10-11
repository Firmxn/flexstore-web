"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";
import { FormErrorAlert } from "@/components/ui/form-error-alert";

// CUST-03 (PH-10): ubah password. Password saat ini wajib benar; password lama
// langsung tidak berlaku setelah berhasil (docs/03 CUST-03 bagian 13).
export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest("/api/customer/profile", {
        method: "PATCH",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setNotice("Password berhasil diubah.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormErrorAlert message={error} />
      {notice ? <Alert variant="success">{notice}</Alert> : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="current-password">Password saat ini</Label>
        <Input
          id="current-password"
          type="password"
          required
          autoComplete="current-password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="new-password">Password baru</Label>
        <Input
          id="new-password"
          type="password"
          required
          minLength={8}
          maxLength={72}
          autoComplete="new-password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="confirm-new-password">Konfirmasi password baru</Label>
        <Input
          id="confirm-new-password"
          type="password"
          required
          minLength={8}
          maxLength={72}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
      </div>

      <Button type="submit" disabled={submitting} className="w-fit">
        {submitting ? "Menyimpan..." : "Ubah Password"}
      </Button>
    </form>
  );
}
