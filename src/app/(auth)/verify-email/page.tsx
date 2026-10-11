import type { Metadata } from "next";
import { connection } from "next/server";
import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";
import { Alert } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Verifikasi Email" };

// CUST-03 (PH-10): halaman publik — otorisasinya token sekali pakai dari query,
// bukan sesi. Pemilik tautan boleh menyelesaikannya tanpa login.
export const instant = false;

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  await connection();
  const { token } = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verifikasi Email</CardTitle>
        <CardDescription>
          Konfirmasi alamat email baru untuk akun Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {token ? (
          <VerifyEmailForm token={token} />
        ) : (
          <Alert variant="destructive">
            Tautan verifikasi tidak valid atau sudah kedaluwarsa.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
