"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp } from "@/lib/app-context";

export default function SignInPage() {
  const { ready, data, signIn } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && data.user) router.replace("/home");
  }, [ready, data.user, router]);

  useEffect(() => {
    if (data.lastEmail) setEmail(data.lastEmail);
  }, [data.lastEmail]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Enter any email and password to continue.");
      return;
    }
    signIn(email.trim(), password);
    router.push("/home");
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-zinc-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Demo mode — use any email and password. No backend required.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-800">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 min-h-12 w-full rounded-xl border border-zinc-300 px-4 text-base outline-none focus:ring-2 focus:ring-zinc-400"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-800">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 min-h-12 w-full rounded-xl border border-zinc-300 px-4 text-base outline-none focus:ring-2 focus:ring-zinc-400"
              placeholder="Any password"
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            type="submit"
            className="min-h-12 w-full rounded-xl bg-zinc-900 text-base font-semibold text-white hover:bg-zinc-800"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
