"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";

// CUST-03 (PH-10): ubah nama dan email akun. Email baru belum berlaku sampai
// tautan verifikasi dibuka; sesi disegarkan diam-diam setelah berhasil.

type ProfileResponse = {
  profile: { name: string; email: string | null };
  emailVerificationSent: boolean;
  pendingEmail?: string;
};

export function AccountProfileForm({
  defaultName,
  defaultEmail,
}: {
  defaultName: string;
  defaultEmail: string;
}) {
  const router = useRouter();
  const { update } = useSession();
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  // Nilai acuan pembanding supaya mengirim ulang tanpa perubahan jadi no-op.
  const [baseline, setBaseline] = useState({ name: defaultName, email: defaultEmail });
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const payload: { name?: string; email?: string } = {};

    if (trimmedName && trimmedName !== baseline.name) payload.name = trimmedName;
    if (trimmedEmail && trimmedEmail.toLowerCase() !== baseline.email.toLowerCase()) {
      payload.email = trimmedEmail;
    }

    if (Object.keys(payload).length === 0) {
      setNotice("Tidak ada perubahan.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await apiRequest<ProfileResponse>("/api/customer/profile", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      setNotice(
        result.emailVerificationSent
          ? "Cek email baru untuk menyelesaikan verifikasi."
          : "Perubahan disimpan.",
      );
      setBaseline({
        name: result.profile.name,
        email: result.pendingEmail ?? result.profile.email ?? "",
      });

      // Sesi disegarkan diam-diam: nama di navbar ikut berubah tanpa login ulang.
      await update({});
      router.refresh();
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error ? <Alert variant="destructive">{error}</Alert> : null}
      {notice ? <Alert>{notice}</Alert> : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="profile-name">Nama</Label>
        <Input
          id="profile-name"
          required
          maxLength={100}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="profile-email">Email</Label>
        <Input
          id="profile-email"
          type="email"
          required
          maxLength={255}
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Mengganti email perlu verifikasi lewat tautan yang dikirim ke alamat
          baru. Email lama tetap aktif sampai verifikasi selesai.
        </p>
      </div>

      <Button type="submit" disabled={submitting} className="w-fit">
        {submitting ? "Menyimpan..." : "Simpan"}
      </Button>
    </form>
  );
}
