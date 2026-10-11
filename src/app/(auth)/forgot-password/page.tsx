import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Lupa Password" };

export default function ForgotPasswordPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lupa Password</CardTitle>
        <CardDescription>
          Masukkan email akun Anda; kami akan mengirim tautan reset password.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <ForgotPasswordForm />

        <p className="text-center text-sm text-muted-foreground">
          Ingat password Anda?{" "}
          <Link href="/login" className="font-medium text-foreground underline">
            Masuk
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
