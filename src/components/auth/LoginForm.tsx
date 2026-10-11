"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/utils/fetcher";

export function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      // Pesan sengaja generik supaya tidak membocorkan email/HP mana yang terdaftar.
      if (!result || result.error) {
        setError("Email/No. HP atau password salah");
        return;
      }

      const session = await getSession();

      // Keranjang guest digabung ke keranjang customer (MOD-CART). Kegagalan
      // di sini tidak menghalangi login.
      await apiRequest("/api/cart/sync", { method: "POST" }).catch(() => null);

      const role = session?.user?.role;

      router.replace(
        role === "STORE_ADMIN"
          ? "/admin/products"
          : role === "SITE_ADMIN"
            ? "/site-admin"
            : "/",
      );
      router.refresh();
    } catch {
      setError("Terjadi kesalahan, coba lagi");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    // Form login memakai autoComplete off + "new-password" di field password:
    // password manager browser menyimpan kredensial dan mengisinya otomatis
    // ketika balik ke halaman login setelah logout, sehingga form tampak
    // "lengket" dengan akun sebelumnya. Mode new-password tidak memicu
    // pengisian otomatis; pilihan akun tetap muncul saat user memfokuskan
    // field (pilihan user, bukan prefill).
    <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-4">
      {error ? <Alert variant="destructive">{error}</Alert> : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="identifier">Email atau Nomor HP</Label>
        <Input
          id="identifier"
          name="identifier"
          autoComplete="off"
          required
          maxLength={255}
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Memproses..." : "Masuk"}
      </Button>
    </form>
  );
}
