"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { saveIdea } from "@/lib/storage";
import { useApp } from "@/lib/app-context";
import { sendChatMessageToN8N, DEFAULT_N8N_WEBHOOK_URL } from "@/lib/n8n";
import { MarkdownMessage } from "@/components/MarkdownMessage";
import { deriveRatingAndStep } from "@/lib/rating-helper";
import type { Idea } from "@/lib/types";

type ChatThreadProps = {
  idea: Idea;
  onUpdate: () => void;
};

function getContextualPrompts(idea: Idea): string[] {
  const name = idea.businessName || "this business";
  const capital = idea.investment || "my investment";
  const loc = idea.location || "this location";

  return [
    `What are the critical risks for ${name}?`,
    `Break down unit economics & monthly profit for ${capital}`,
    `Which government schemes or Mudra/PMEGP subsidies apply to ${name}?`,
    `What licenses & local approvals are required in ${loc}?`,
    `How do I acquire the first 50 customers in ${loc}?`,
    `Draft a 30-day execution checklist for ${name}`,
  ];
}

export function ChatThread({ idea, onUpdate }: ChatThreadProps) {
  const { data } = useApp();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeWebhookUrl =
    data.settings?.webhookUrl?.trim() || DEFAULT_N8N_WEBHOOK_URL;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [idea.messages.length, sending]);

  const sendMessage = async (message: string) => {
    const trimmed = message.trim();
    if (!trimmed || sending) return;

    setSending(true);
    const now = new Date().toISOString();
    const userMsg = {
      id: `u-${Date.now()}`,
      role: "user" as const,
      text: trimmed,
      at: now,
    };

    // Prepare previous history for the n8n agent
    const historyPayload = idea.messages.map((m) => ({
      role: m.role === "user" ? ("user" as const) : ("assistant" as const),
      content: m.text,
    }));

    const updatedWithUser: Idea = {
      ...idea,
      lastChatAt: now,
      summary: trimmed.slice(0, 100) + (trimmed.length > 100 ? "…" : ""),
      messages: [...idea.messages, userMsg],
    };

    saveIdea(updatedWithUser);
    onUpdate();
    setText("");

    let botResponseText = "";
    try {
      botResponseText = await sendChatMessageToN8N({
        message: trimmed,
        sessionId: idea.id,
        webhookUrl: activeWebhookUrl,
        history: historyPayload,
        businessName: idea.businessName,
        investment: idea.investment,
        location: idea.location,
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      botResponseText = `❌ **Live n8n Connection Error:** ${errMsg}\n\n**Troubleshooting steps:**\n1. Ensure your n8n workflow is toggled to **Active** (or click 'Listen for test event').\n2. Verify n8n is running at \`${activeWebhookUrl}\`.\n3. In n8n, ensure your Webhook node HTTP Method is **POST**.\n4. You can configure or test the webhook URL in [Settings](/settings).`;
    }

    const botMsg = {
      id: `b-${Date.now()}`,
      role: "bot" as const,
      text: botResponseText,
      at: new Date().toISOString(),
    };

    const derived = deriveRatingAndStep(botResponseText);

    saveIdea({
      ...updatedWithUser,
      messages: [...updatedWithUser.messages, botMsg],
      lastChatAt: botMsg.at,
      summary:
        botResponseText.replace(/[#*`_]/g, "").slice(0, 130) +
        (botResponseText.length > 130 ? "…" : ""),
      rating: derived.rating || idea.rating,
      step: derived.step || idea.step,
    });

    onUpdate();
    setSending(false);
  };

  const retryPendingMessage = async (userPrompt: string) => {
    if (sending) return;
    setSending(true);

    const historyPayload = idea.messages
      .slice(0, -1)
      .map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      }));

    let botResponseText = "";
    try {
      botResponseText = await sendChatMessageToN8N({
        message: userPrompt,
        sessionId: idea.id,
        webhookUrl: activeWebhookUrl,
        history: historyPayload,
        businessName: idea.businessName,
        investment: idea.investment,
        location: idea.location,
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      botResponseText = `❌ **Live n8n Connection Error:** ${errMsg}\n\n**Troubleshooting steps:**\n1. Ensure your n8n workflow is toggled to **Active**.\n2. Verify n8n is running at \`${activeWebhookUrl}\`.\n3. In n8n, ensure your Webhook node HTTP Method is **POST**.\n4. You can configure or test the webhook URL in [Settings](/settings).`;
    }

    const botMsg = {
      id: `b-${Date.now()}`,
      role: "bot" as const,
      text: botResponseText,
      at: new Date().toISOString(),
    };

    const derived = deriveRatingAndStep(botResponseText);

    saveIdea({
      ...idea,
      messages: [...idea.messages, botMsg],
      lastChatAt: botMsg.at,
      summary:
        botResponseText.replace(/[#*`_]/g, "").slice(0, 130) +
        (botResponseText.length > 130 ? "…" : ""),
      rating: derived.rating || idea.rating,
      step: derived.step || idea.step,
    });

    onUpdate();
    setSending(false);
  };

  const contextualPrompts = getContextualPrompts(idea);
  const lastMsg = idea.messages[idea.messages.length - 1];
  const hasPendingUserMsg = lastMsg && lastMsg.role === "user";

  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-1 flex-col">
      {/* Live Connection Status Banner */}
      <div className="mb-2 flex items-center justify-between rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-3.5 py-1.5 text-xs text-emerald-900">
        <div className="flex items-center gap-2 truncate">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-emerald-800">Strict Live Mode:</span>
          <span className="truncate font-mono text-[11px] text-emerald-700">
            {activeWebhookUrl}
          </span>
        </div>
        <Link
          href="/settings"
          className="shrink-0 text-[11px] font-medium text-emerald-800 underline hover:text-emerald-950 ml-2"
        >
          Change URL
        </Link>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-4 md:p-6 shadow-xs">
        {idea.messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.role === "bot" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-orange-600 to-amber-600 text-[10px] font-bold text-white shadow-xs">
                AI
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed md:text-base ${
                m.role === "user"
                  ? "rounded-tr-xs bg-zinc-900 text-white shadow-xs"
                  : "rounded-tl-xs border border-zinc-100 bg-zinc-50/80 text-zinc-800"
              }`}
            >
              {m.role === "user" ? (
                <div className="whitespace-pre-wrap">{m.text}</div>
              ) : (
                <MarkdownMessage content={m.text} />
              )}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex items-start gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-orange-600 to-amber-600 text-[10px] font-bold text-white shadow-xs">
              AI
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-xs border border-zinc-100 bg-zinc-50 px-4 py-3 text-xs text-zinc-500 shadow-xs">
              <span>Waiting for n8n response</span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-500 [animation-delay:-0.3s]"></span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-500 [animation-delay:-0.15s]"></span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500"></span>
              </span>
            </div>
          </div>
        )}

        {hasPendingUserMsg && !sending && (
          <div className="flex items-center justify-between rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">⏳</span>
              <span>This initial prompt has not received an n8n response yet.</span>
            </div>
            <button
              type="button"
              onClick={() => void retryPendingMessage(lastMsg.text)}
              className="rounded-lg bg-amber-600 px-3 py-1.5 font-semibold text-white hover:bg-amber-700 transition"
            >
              Analyze with n8n
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestion Quick Prompts - 100% Contextual to this specific idea */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {contextualPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={sending}
            onClick={() => sendMessage(prompt)}
            className="rounded-full border border-zinc-200/90 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-2xs transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input Form */}
      <form
        className="mt-2.5 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void sendMessage(text);
        }}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask your n8n business advisor..."
          className="min-h-12 flex-1 rounded-full border border-zinc-300 bg-white px-5 text-sm outline-none ring-orange-500/20 focus:border-orange-500 focus:ring-4 transition"
          disabled={sending}
        />
          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="min-h-12 shrink-0 rounded-full bg-zinc-900 px-5 sm:px-6 text-sm font-semibold text-white shadow-xs transition hover:bg-zinc-800 active:scale-[0.99] disabled:opacity-50"
          >
            Send
          </button>
      </form>
    </div>
  );
}
