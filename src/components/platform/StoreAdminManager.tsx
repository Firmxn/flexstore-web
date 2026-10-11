"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createStoreAdminSchema } from "@/lib/platform/validation";
import { apiRequest, toErrorMessage } from "@/lib/utils/fetcher";
import { formatDateTime } from "@/lib/utils/format";
import { FormErrorAlert } from "@/components/ui/form-error-alert";

// SITE-04 (PH-08): kelola akun Store Admin — buat, aktif/nonaktif, reset
// password. Kredensial dibagikan manual oleh Site Admin (tanpa email).

export type StoreAdminRow = {
  id: string;
  name: string;
  email: string | null;
  deactivatedAt: string | null;
  createdAt: string;
};

export function StoreAdminManager({ initial }: { initial: StoreAdminRow[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetTarget, setResetTarget] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function begin() {
    setError(null);
    setNotice(null);
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    begin();

    const parsed = createStoreAdminSchema.safeParse({ name, email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Data tidak valid");
      return;
    }

    setBusy(true);
    try {
      await apiRequest("/api/site-admin/users", {
        method: "POST",
        body: JSON.stringify(parsed.data),
      });
      setNotice(
        `Akun ${parsed.data.email} dibuat. Sampaikan kredensialnya secara aman.`,
      );
      setName("");
      setEmail("");
      setPassword("");
      router.refresh();
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  async function patchUser(id: string, body: Record<string, unknown>) {
    begin();
    setBusy(true);
    try {
      await apiRequest(`/api/site-admin/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      router.refresh();
      return true;
    } catch (caught) {
      setError(toErrorMessage(caught));
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(row: StoreAdminRow) {
    const ok = await patchUser(row.id, { active: row.deactivatedAt !== null });
    if (ok) {
      setNotice(
        row.deactivatedAt ? `${row.name} diaktifkan kembali.` : `${row.name} dinonaktifkan.`,
      );
    }
  }

  async function submitReset(row: StoreAdminRow) {
    const ok = await patchUser(row.id, { password: resetPassword });
    if (ok) {
      setNotice(`Password ${row.name} diperbarui.`);
      setResetTarget(null);
      setResetPassword("");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <FormErrorAlert message={error} />
      {notice ? <Alert variant="success">{notice}</Alert> : null}

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
        <h2 className="font-semibold">Tambah Store Admin</h2>
        <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="admin-name">Nama</Label>
            <Input
              id="admin-name"
              required
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              required
              maxLength={200}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="admin-password">Password awal</Label>
            <Input
              id="admin-password"
              type="password"
              required
              minLength={8}
              maxLength={72}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="sm:col-span-3">
            <Button type="submit" disabled={busy}>
              {busy ? "Menyimpan..." : "Buat Akun"}
            </Button>
          </div>
        </form>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">Akun Store Admin</h2>
        {initial.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada akun Store Admin.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initial.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>{row.email ?? "-"}</TableCell>
                  <TableCell>
                    <Badge variant={row.deactivatedAt ? "destructive" : "success"}>
                      {row.deactivatedAt ? "Nonaktif" : "Aktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(row.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={busy}
                          onClick={() => toggleActive(row)}
                        >
                          {row.deactivatedAt ? "Aktifkan" : "Nonaktifkan"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={busy}
                          onClick={() => {
                            begin();
                            setResetTarget(
                              resetTarget === row.id ? null : row.id,
                            );
                            setResetPassword("");
                          }}
                        >
                          Reset Password
                        </Button>
                      </div>

                      {resetTarget === row.id ? (
                        <div className="flex items-end gap-2">
                          <div className="flex flex-col gap-1">
                            <Label htmlFor={`reset-${row.id}`} className="text-xs">
                              Password baru
                            </Label>
                            <Input
                              id={`reset-${row.id}`}
                              type="password"
                              minLength={8}
                              maxLength={72}
                              value={resetPassword}
                              onChange={(event) =>
                                setResetPassword(event.target.value)
                              }
                            />
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            disabled={busy || resetPassword.length < 8}
                            onClick={() => submitReset(row)}
                          >
                            Simpan
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  );
}
