"use client";

import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/app-context";

export default function SettingsPage() {
  const { data, updateSettings } = useApp();
  const { settings } = data;

  return (
    <AppShell variant="back" title="Settings">
      <div className="mx-auto w-full max-w-lg space-y-4">
        <label className="flex min-h-14 cursor-pointer items-center justify-between rounded-2xl border border-zinc-200 bg-white px-5">
          <span className="font-medium">Notifications banner on home</span>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) => updateSettings({ notifications: e.target.checked })}
            className="h-5 w-5 rounded border-zinc-300"
          />
        </label>
        <label className="flex min-h-14 cursor-pointer items-center justify-between rounded-2xl border border-zinc-200 bg-white px-5">
          <span className="font-medium">Compact idea cards</span>
          <input
            type="checkbox"
            checked={settings.compactCards}
            onChange={(e) => updateSettings({ compactCards: e.target.checked })}
            className="h-5 w-5 rounded border-zinc-300"
          />
        </label>
        <p className="text-sm text-zinc-500">
          Settings are saved in this browser only ({process.env.NEXT_PUBLIC_STORAGE_KEY}).
        </p>
      </div>
    </AppShell>
  );
}
