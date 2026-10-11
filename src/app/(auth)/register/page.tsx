import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Alert } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPlatformSettings } from "@/lib/platform";

export const metadata: Metadata = { title: "Daftar" };

// Halaman ini membaca pengaturan platform (SITE-01), jadi tidak diprerender.
export const instant = false;

export default async function RegisterPage() {
  const platform = await getPlatformSettings();
  const closed = !platform.registrationEnabled;

  return (
    <div className="flex flex-col">
      <Card>
        <CardHeader>
          <CardTitle>Buat Akun FlexStore</CardTitle>
          <CardDescription>
            Nomor HP bersifat opsional dan bisa ditambahkan nanti.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {closed ? (
            <Alert variant="destructive">
              Pendaftaran sedang ditutup. Silakan coba lagi nanti.
            </Alert>
          ) : (
            <RegisterForm />
          )}

          <p className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-medium text-foreground underline">
              Masuk
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
