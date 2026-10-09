import type { Metadata } from "next";
import { OtpVerificationForm } from "@/components/auth/OtpVerificationForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Verifikasi Nomor HP" };

// Halaman demo AUTH-01 untuk PH-01. Di PH-03 form yang sama dipakai di /checkout.
export default function VerifyPhonePage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Verifikasi Nomor HP</CardTitle>
          <CardDescription>
            Kami akan mengirim kode OTP 6 digit yang berlaku 5 menit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OtpVerificationForm />
        </CardContent>
      </Card>
    </div>
  );
}
