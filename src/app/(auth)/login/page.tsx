import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getBrandSetting } from "@/lib/brand";

export const metadata: Metadata = { title: "Masuk" };

export default async function LoginPage() {
  // SITE-05 (PH-09): nama brand dari pengaturan Site Admin.
  const brand = await getBrandSetting();

  return (
    <div className="flex flex-col">
      <Card>
        <CardHeader>
          <CardTitle>Masuk ke {brand.brandName}</CardTitle>
          <CardDescription>
            Gunakan email atau nomor HP yang terdaftar.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <LoginForm />

          <p className="text-center text-sm text-muted-foreground">
            <Link
              href="/forgot-password"
              className="font-medium text-foreground underline"
            >
              Lupa password?
            </Link>
          </p>

          <p className="text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/register" className="font-medium text-foreground underline">
              Daftar sekarang
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
