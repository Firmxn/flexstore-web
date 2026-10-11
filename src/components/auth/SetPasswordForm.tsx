"use client";

import { useState } from "react";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";
import { FormErrorAlert } from "@/components/ui/form-error-alert";

// AUTH-04 (PH-07): guest yang mengisi email saat checkout membuat akun lewat
// tautan set password. Token dikirim di query dan diteruskan ke API.
export function SetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest("/api/auth/set-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      setDone(true);
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col gap-4">
        <Alert>
          Akun berhasil dibuat. Silakan masuk dengan email dan password Anda.
        </Alert>
        <Link
          href="/login"
          className="text-center text-sm font-medium underline"
        >
          Masuk sekarang
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormErrorAlert message={error} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="set-password">Password baru</Label>
        <Input
          id="set-password"
          type="password"
          required
          minLength={8}
          maxLength={72}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="set-password-confirm">Konfirmasi password</Label>
        <Input
          id="set-password-confirm"
          type="password"
          required
          minLength={8}
          maxLength={72}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
      </div>

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Menyimpan..." : "Buat Password"}
      </Button>
    </form>
  );
}
