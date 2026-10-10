"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

type LogoutButtonProps = {
  className?: string;
  // Ikon opsional di depan label, untuk penempatan di menu yang seragam.
  icon?: ReactNode;
};

export function LogoutButton({ className, icon }: LogoutButtonProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleLogout() {
    setSubmitting(true);
    await signOut({ redirect: false });
    router.replace("/");
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      disabled={submitting}
      onClick={handleLogout}
    >
      {icon}
      {submitting ? "Keluar..." : "Keluar"}
    </Button>
  );
}
