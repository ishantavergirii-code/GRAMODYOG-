"use client";

import { useEffect, useRef, useState } from "react";
import { getSuggestionPills, mockBotReply } from "@/lib/bot";
import { saveIdea } from "@/lib/storage";
import type { Idea } from "@/lib/types";

type ChatThreadProps = {
  idea: Idea;
  onUpdate: () => void;
};

export function ChatThread({ idea, onUpdate }: ChatThreadProps) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pills = getSuggestionPills();

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

    const updated: Idea = {
      ...idea,
      lastChatAt: now,
      summary: trimmed.slice(0, 100) + (trimmed.length > 100 ? "…" : ""),
      messages: [...idea.messages, userMsg],
    };
    saveIdea(updated);
    onUpdate();
    setText("");

    await new Promise((r) => setTimeout(r, 600));

    const botText = mockBotReply(trimmed, idea.businessName);
    const botMsg = {
      id: `b-${Date.now()}`,
      role: "bot" as const,
      text: botText,
      at: new Date().toISOString(),
    };
    saveIdea({
      ...updated,
      messages: [...updated.messages, botMsg],
      lastChatAt: botMsg.at,
      summary: botText.slice(0, 120) + "…",
    });
    onUpdate();
    setSending(false);
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-1 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-4 md:p-6">
        {idea.messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed md:text-base ${
                m.role === "user"
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-800"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {sending ? (
          <p className="text-sm text-zinc-500">Thinking…</p>
        ) : null}
        <div ref={bottomRef} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {pills.map((pill) => (
          <button
            key={pill}
            type="button"
            disabled={sending}
            onClick={() => sendMessage(pill)}
            className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 disabled:opacity-50"
          >
            {pill}
          </button>
        ))}
      </div>

      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void sendMessage(text);
        }}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          className="min-h-12 flex-1 rounded-full border border-zinc-300 bg-white px-4 text-base outline-none ring-zinc-400 focus:ring-2"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="min-h-12 shrink-0 rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
