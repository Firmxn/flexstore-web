"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      router.replace(
        session?.user?.role === "STORE_ADMIN" ? "/admin/products" : "/",
      );
      router.refresh();
    } catch {
      setError("Terjadi kesalahan, coba lagi");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error ? <Alert variant="destructive">{error}</Alert> : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="identifier">Email atau Nomor HP</Label>
        <Input
          id="identifier"
          name="identifier"
          autoComplete="username"
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
          autoComplete="current-password"
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
