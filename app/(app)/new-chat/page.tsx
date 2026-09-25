"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { createIdeaFromForm } from "@/lib/ideas-factory";
import { saveIdea } from "@/lib/storage";
import { useApp } from "@/lib/app-context";
import { sendChatMessageToN8N, DEFAULT_N8N_WEBHOOK_URL } from "@/lib/n8n";

const PRESET_IDEAS = [
  {
    name: "Flour Mill (Atta Chakki)",
    investment: "₹ 1,50,000",
    location: "Village Rampur",
    badge: "Agri-Processing",
  },
  {
    name: "Cold Storage Micro-Unit",
    investment: "₹ 5,00,000",
    location: "Nashik Rural",
    badge: "Supply Chain",
  },
  {
    name: "Organic Spice Grinding",
    investment: "₹ 2,00,000",
    location: "Tier-3 Town Hub",
    badge: "Food & Retail",
  },
];

export default function NewChatPage() {
  const router = useRouter();
  const { data, refresh } = useApp();
  const [businessName, setBusinessName] = useState("");
  const [investment, setInvestment] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [n8nStatus, setN8nStatus] = useState<string>("");
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const activeWebhook =
    data.settings?.webhookUrl?.trim() || DEFAULT_N8N_WEBHOOK_URL;

  const applyPreset = (preset: (typeof PRESET_IDEAS)[0]) => {
    setBusinessName(preset.name);
    setInvestment(preset.investment);
    setLocation(preset.location);
    setError("");
    setConnectionError(null);
  };

  const handleCreateIdea = async (bypassN8n = false) => {
    const bName = businessName.trim();
    const inv = investment.trim();
    const loc = location.trim();

    if (!bName || !inv || !loc) {
      setError("Please fill in all three fields to evaluate your idea.");
      return;
    }

    setError("");
    setConnectionError(null);

    const ideaId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `idea-${Date.now()}`;

    const promptText = `I want to open a ${bName} in ${loc} with ${inv} capital. Please provide a detailed feasibility analysis, key operational risks, and recommended immediate next steps.`;

    if (bypassN8n) {
      const fallbackIdea = createIdeaFromForm({
        customId: ideaId,
        businessName: bName,
        investment: inv,
        location: loc,
        initialPrompt: promptText,
      });
      saveIdea(fallbackIdea);
      refresh();
      router.push(`/chat/${fallbackIdea.id}`);
      return;
    }

    setSubmitting(true);
    setN8nStatus("Connecting to live n8n workflow...");

    try {
      const response = await sendChatMessageToN8N({
        message: promptText,
        sessionId: ideaId,
        webhookUrl: activeWebhook,
        businessName: bName,
        investment: inv,
        location: loc,
        history: [],
      });

      const newIdea = createIdeaFromForm({
        customId: ideaId,
        businessName: bName,
        investment: inv,
        location: loc,
        initialPrompt: promptText,
        initialResponse: response,
      });

      saveIdea(newIdea);
      refresh();
      router.push(`/chat/${newIdea.id}`);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setConnectionError(errMsg);
      setSubmitting(false);
      setN8nStatus("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleCreateIdea(false);
  };

  return (
    <AppShell variant="back" title="New Business Analysis">
      <div className="mx-auto w-full max-w-lg min-w-0 space-y-5">
        {/* Subtle Live n8n Engine Pill */}
        <div className="flex items-center justify-between gap-2 rounded-xl border border-zinc-200/90 bg-white px-3.5 py-2 text-xs shadow-2xs">
          <div className="flex min-w-0 items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="truncate font-medium text-zinc-700">
              n8n Live Engine
            </span>
            <span className="hidden sm:inline-block text-zinc-300">•</span>
            <span className="hidden sm:inline-block truncate font-mono text-[11px] text-zinc-500">
              {activeWebhook}
            </span>
          </div>
          <Link
            href="/settings"
            className="shrink-0 text-[11px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Configure
          </Link>
        </div>

        {/* Main Form Card */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
              Idea Parameters
            </h2>
            <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
              Enter your project details to run a live feasibility evaluation
              through your n8n business advisor workflow.
            </p>
          </div>

          {/* Quick Idea Presets */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Quick Samples
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PRESET_IDEAS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  disabled={submitting}
                  onClick={() => applyPreset(preset)}
                  className="flex flex-col items-start justify-between rounded-xl border border-zinc-200/80 bg-zinc-50/60 p-2.5 text-left transition hover:border-zinc-300 hover:bg-zinc-100/70 disabled:opacity-50"
                >
                  <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">
                    {preset.badge}
                  </span>
                  <span className="mt-1 text-xs font-semibold text-zinc-800 line-clamp-1">
                    {preset.name}
                  </span>
                  <span className="mt-1 font-mono text-[11px] font-medium text-emerald-700">
                    {preset.investment}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Business Concept / Category
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Flour Mill, Solar Irrigation, Cold Storage"
                disabled={submitting}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Target Investment Capital
              </label>
              <input
                type="text"
                value={investment}
                onChange={(e) => setInvestment(e.target.value)}
                placeholder="e.g. ₹ 1,50,000"
                disabled={submitting}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Proposed Location / Area
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Village Rampur, District Pune"
                disabled={submitting}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-100"
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-red-600">{error}</p>
            )}

            {/* Connection Error Callout */}
            {connectionError && (
              <div className="rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-xs text-red-800 space-y-2.5">
                <div className="flex items-center gap-1.5 font-semibold text-red-900">
                  <svg className="h-4 w-4 shrink-0 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                  <span>n8n Connection Failed</span>
                </div>
                <p className="break-all font-mono text-[11px] text-red-700 bg-red-100/60 p-2 rounded-lg">
                  {connectionError}
                </p>
                <div className="text-[11px] text-red-700 space-y-1">
                  <p><strong>Remedy Checklist:</strong></p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>Verify local n8n is active on port 5678.</li>
                    <li>Ensure workflow is set to <strong>Active</strong>.</li>
                    <li>Verify HTTP method on Webhook node is <strong>POST</strong>.</li>
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCreateIdea(false)}
                    className="rounded-lg bg-red-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-800 transition"
                  >
                    Retry Analysis
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCreateIdea(true)}
                    className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-800 hover:bg-red-50 transition"
                  >
                    Open Draft in Chat
                  </button>
                </div>
              </div>
            )}

            {/* Submitting Loading Indicator */}
            {submitting && (
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 text-xs text-zinc-700 space-y-2">
                <div className="flex items-center gap-2 font-medium text-zinc-900">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-800 border-t-transparent" />
                  <span>{n8nStatus}</span>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Running feasibility checks and stress-testing financial models. This typically takes 5–15 seconds.
                </p>
              </div>
            )}

            {/* Professional Primary Action Button */}
            <button
              type="submit"
              disabled={submitting}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 px-5 text-sm font-semibold text-white shadow-xs transition hover:bg-zinc-800 active:scale-[0.99] disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Evaluating Feasibility...</span>
                </>
              ) : (
                <>
                  <span>Evaluate Business Feasibility</span>
                  <svg
                    className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
