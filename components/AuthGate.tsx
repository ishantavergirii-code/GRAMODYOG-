"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useApp } from "@/lib/app-context";

export function AuthGate({ children }: { children: ReactNode }) {
  const { ready, data } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!data.user) router.replace("/sign-in");
  }, [ready, data.user, router]);

  if (!ready || !data.user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-zinc-50 text-zinc-600">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}
