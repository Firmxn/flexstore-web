import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { SetPasswordForm } from "@/components/auth/SetPasswordForm";
import { Alert } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Buat Password" };

// AUTH-04 (PH-07): halaman publik, token dibaca dari query.
export const instant = false;

export default async function SetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  await connection();
  const { token } = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buat Password</CardTitle>
        <CardDescription>
          Buat password untuk mengakses riwayat pesanan dan alamat Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {token ? (
          <SetPasswordForm token={token} />
        ) : (
          <div className="flex flex-col gap-4">
            <Alert variant="destructive">
              Tautan tidak valid. Minta tautan baru dari email konfirmasi pesanan
              Anda.
            </Alert>
            <Link
              href="/login"
              className="text-center text-sm font-medium underline"
            >
              Kembali ke halaman masuk
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
