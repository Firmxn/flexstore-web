"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { otpCodeSchema, phoneSchema } from "@/lib/auth/validation";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";

type Step = "phone" | "code" | "verified";

type OtpVerificationFormProps = {
  // Dipakai alur checkout (PH-03): memberi tahu nomor yang sudah terverifikasi
  // supaya form pesanan bisa mengisi `guestPhone`.
  onVerified?: (phone: string) => void;
};

// AUTH-01: verifikasi nomor HP guest lewat OTP.
// Dipakai di langkah verifikasi alur checkout (PH-03).
export function OtpVerificationForm({ onVerified }: OtpVerificationFormProps = {}) {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);

    const parsed = phoneSchema.safeParse(phone);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Nomor HP tidak valid");
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest("/api/otp/send", {
        method: "POST",
        body: JSON.stringify({ phone: parsed.data }),
      });
      setPhone(parsed.data);
      setStep("code");
      setNotice("Kode OTP sudah dikirim. Berlaku 5 menit.");
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = otpCodeSchema.safeParse(code);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Kode OTP tidak valid");
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest("/api/otp/verify", {
        method: "POST",
        body: JSON.stringify({ phone, code: parsed.data }),
      });
      setNotice(null);
      setStep("verified");
      onVerified?.(phone);
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "verified") {
    return (
      <Alert variant="success">
        Nomor {phone} berhasil diverifikasi.
      </Alert>
    );
  }

  if (step === "code") {
    return (
      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        {error ? <Alert variant="destructive">{error}</Alert> : null}
        {notice ? <Alert>{notice}</Alert> : null}

        <div className="flex flex-col gap-2">
          <Label htmlFor="otp-code">Kode OTP (6 digit)</Label>
          <Input
            id="otp-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            required
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
        </div>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Memverifikasi..." : "Verifikasi"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={submitting}
          onClick={() => {
            setStep("phone");
            setCode("");
            setNotice(null);
            setError(null);
          }}
        >
          Ganti nomor HP
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSend} className="flex flex-col gap-4">
      {error ? <Alert variant="destructive">{error}</Alert> : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="otp-phone">Nomor HP</Label>
        <Input
          id="otp-phone"
          inputMode="tel"
          autoComplete="tel"
          placeholder="08123456789"
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </div>

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Mengirim..." : "Kirim OTP"}
      </Button>
    </form>
  );
}
