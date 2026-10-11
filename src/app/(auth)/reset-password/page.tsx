import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Alert } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Reset Password" };

// AUTH-05 (PH-07): halaman publik, token dibaca dari query.
export const instant = false;

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  await connection();
  const { token } = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Buat password baru untuk akun Anda.</CardDescription>
      </CardHeader>
      <CardContent>
        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="flex flex-col gap-4">
            <Alert variant="destructive">
              Tautan tidak valid atau sudah kedaluwarsa. Minta tautan baru.
            </Alert>
            <Link
              href="/forgot-password"
              className="text-center text-sm font-medium underline"
            >
              Minta tautan reset
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
