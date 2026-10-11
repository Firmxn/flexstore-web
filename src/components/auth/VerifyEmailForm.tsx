"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";

// CUST-03 (PH-10): menyelesaikan verifikasi email baru. Setelah sukses, sesi
// disegarkan diam-diam supaya email baru langsung dipakai tanpa login ulang.
export function VerifyEmailForm({ token }: { token: string }) {
  const router = useRouter();
  const { update } = useSession();
  const [verifying, setVerifying] = useState(false);
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleVerify() {
    setError(null);
    setVerifying(true);
    try {
      const result = await apiRequest<{ email: string }>(
        "/api/auth/verify-email",
        { method: "POST", body: JSON.stringify({ token }) },
      );
      setEmail(result.email);
      setDone(true);
      await update({});
      router.refresh();
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setVerifying(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col gap-4">
        <Alert variant="success">Email berhasil diverifikasi.</Alert>
        {email ? (
          <p className="text-sm text-muted-foreground">
            Alamat email akun Anda kini {email}.
          </p>
        ) : null}
        <Link
          href="/profile"
          className="text-center text-sm font-medium underline"
        >
          Buka profil
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {error ? (
        <>
          <Alert variant="destructive">{error}</Alert>
          <Link
            href="/profile"
            className="text-center text-sm font-medium underline"
          >
            Minta tautan baru
          </Link>
        </>
      ) : null}

      <Button
        type="button"
        onClick={handleVerify}
        disabled={verifying}
        className="w-full"
      >
        {verifying ? "Memverifikasi..." : "Verifikasi email"}
      </Button>
    </div>
  );
}
