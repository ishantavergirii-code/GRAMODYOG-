"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useApp } from "@/lib/app-context";

export default function RootPage() {
  const { ready, data } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    router.replace(data.user ? "/home" : "/sign-in");
  }, [ready, data.user, router]);

  return (
    <div className="flex min-h-dvh items-center justify-center text-zinc-600">
      Loading…
    </div>
  );
}
