"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/app-context";
import { DEFAULT_N8N_WEBHOOK_URL, sendChatMessageToN8N } from "@/lib/n8n";

export default function SettingsPage() {
  const { data, updateSettings } = useApp();
  const { settings } = data;
  const [webhookInput, setWebhookInput] = useState(
    settings.webhookUrl || DEFAULT_N8N_WEBHOOK_URL
  );
  const [testStatus, setTestStatus] = useState<
    "idle" | "testing" | "success" | "error"
  >("idle");
  const [testFeedback, setTestFeedback] = useState("");
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    const url = webhookInput.trim() || DEFAULT_N8N_WEBHOOK_URL;
    updateSettings({ webhookUrl: url });
    // Also keep in localStorage for backward compatibility with external scripts
    if (typeof window !== "undefined") {
      localStorage.setItem("gramodyog_webhook_url", url);
    }
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleResetDefault = () => {
    setWebhookInput(DEFAULT_N8N_WEBHOOK_URL);
    updateSettings({ webhookUrl: DEFAULT_N8N_WEBHOOK_URL });
    if (typeof window !== "undefined") {
      localStorage.setItem("gramodyog_webhook_url", DEFAULT_N8N_WEBHOOK_URL);
    }
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleTestConnection = async () => {
    setTestStatus("testing");
    setTestFeedback("");
    try {
      const response = await sendChatMessageToN8N({
        message: "Hello from GRAMODYOG Connection Diagnostic Test",
        sessionId: `diagnostic_${Date.now()}`,
        webhookUrl: webhookInput.trim() || DEFAULT_N8N_WEBHOOK_URL,
      });

      setTestStatus("success");
      setTestFeedback(
        `Connected successfully! n8n response preview: "${response.slice(
          0,
          100
        )}${response.length > 100 ? "..." : ""}"`
      );
    } catch (err: unknown) {
      setTestStatus("error");
      const msg = err instanceof Error ? err.message : String(err);
      setTestFeedback(msg);
    }
  };

  return (
    <AppShell variant="back" title="Settings">
      <div className="mx-auto w-full max-w-xl space-y-6">
        {/* n8n Webhook Configuration Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              n8n Live Webhook Workflow
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
              Live Mode
            </span>
          </div>

          <p className="text-xs text-zinc-500 leading-relaxed">
            All AI responses stream directly from your n8n workflow. Ensure your
            n8n node is listening via POST.
          </p>

          <form onSubmit={handleSaveWebhook} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Webhook URL:
              </label>
              <input
                type="text"
                value={webhookInput}
                onChange={(e) => setWebhookInput(e.target.value)}
                placeholder="http://localhost:5678/webhook/gramodyog-chat-trigger"
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-xs font-mono outline-none focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="submit"
                className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-orange-700 transition"
              >
                Save URL
              </button>
              <button
                type="button"
                onClick={handleResetDefault}
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition"
              >
                Reset Default
              </button>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testStatus === "testing"}
                className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 hover:bg-emerald-100 transition disabled:opacity-50"
              >
                {testStatus === "testing" ? "Testing..." : "Test Connection"}
              </button>
            </div>
          </form>

          {savedNotice && (
            <p className="text-xs font-medium text-emerald-600">
              ✓ Webhook URL saved successfully.
            </p>
          )}

          {testStatus === "success" && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
              <p className="font-semibold">✓ Connection Verified!</p>
              <p className="mt-1 text-emerald-700">{testFeedback}</p>
            </div>
          )}

          {testStatus === "error" && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800 space-y-1">
              <p className="font-semibold">✕ Connection Failed</p>
              <p className="text-red-700 font-mono text-[11px]">{testFeedback}</p>
              <p className="mt-1 text-[11px] text-red-600">
                Troubleshooting: Ensure n8n is running locally and the workflow is Active or listening for test events.
              </p>
            </div>
          )}
        </div>

        {/* General Preferences */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
          <h2 className="text-sm font-semibold text-zinc-900">Preferences</h2>
          <label className="flex cursor-pointer items-center justify-between py-1">
            <span className="text-sm text-zinc-700">Notifications banner on home</span>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => updateSettings({ notifications: e.target.checked })}
              className="h-4 w-4 rounded border-zinc-300 accent-orange-600"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between py-1">
            <span className="text-sm text-zinc-700">Compact idea cards</span>
            <input
              type="checkbox"
              checked={settings.compactCards}
              onChange={(e) => updateSettings({ compactCards: e.target.checked })}
              className="h-4 w-4 rounded border-zinc-300 accent-orange-600"
            />
          </label>
        </div>

        {/* n8n Setup Quick Guide */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-900 space-y-2">
          <p className="font-bold flex items-center gap-1.5">
            💡 Quick n8n Setup Guide
          </p>
          <ol className="list-decimal pl-4 space-y-1 text-amber-800">
            <li>Ensure your Webhook node HTTP Method is <strong>POST</strong>.</li>
            <li>Path: <code className="bg-amber-100 px-1 py-0.5 rounded">gramodyog-chat-trigger</code>.</li>
            <li>Webhook URL: <code className="bg-amber-100 px-1 py-0.5 rounded">http://localhost:5678/webhook/gramodyog-chat-trigger</code>.</li>
            <li>Toggle the workflow to <strong>Active</strong> in the top-right corner of n8n.</li>
          </ol>
        </div>

        <p className="text-xs text-zinc-400 text-center">
          GRAMODYOG • Live n8n Integration • Localhost
        </p>
      </div>
    </AppShell>
  );
}
