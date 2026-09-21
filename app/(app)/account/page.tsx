"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/app-context";

export default function AccountPage() {
  const { data, updateUser, signOut } = useApp();
  const router = useRouter();
  const [name, setName] = useState(data.user?.displayName ?? "");
  const [saved, setSaved] = useState(false);

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateUser({ displayName: name.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppShell variant="back" title="Account">
      <div className="mx-auto w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 md:p-8">
        <form onSubmit={onSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium">Display name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 min-h-12 w-full rounded-xl border border-zinc-300 px-4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              value={data.user?.email ?? ""}
              readOnly
              className="mt-2 min-h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-zinc-600"
            />
          </div>
          {saved ? (
            <p className="text-sm text-emerald-700">Saved — home greeting will update.</p>
          ) : null}
          <button
            type="submit"
            className="min-h-11 rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white"
          >
            Save changes
          </button>
        </form>
        <button
          type="button"
          onClick={() => {
            signOut();
            router.push("/sign-in");
          }}
          className="mt-8 min-h-11 w-full rounded-xl border border-red-200 text-sm font-semibold text-red-700 hover:bg-red-50"
        >
          Sign out
        </button>
      </div>
    </AppShell>
  );
}
