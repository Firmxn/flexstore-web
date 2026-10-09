"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LogoutButton({ className }: { className?: string }) {
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
      {submitting ? "Keluar..." : "Keluar"}
    </Button>
  );
}
