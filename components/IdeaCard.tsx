"use client";

import Link from "next/link";
import type { Idea } from "@/lib/types";

type IdeaCardProps = {
  idea: Idea;
  compact?: boolean;
  onArchive?: (id: string) => void;
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function IdeaCard({ idea, compact, onArchive }: IdeaCardProps) {
  return (
    <article
      className={`group relative flex flex-col rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:border-zinc-300 hover:shadow-md ${
        compact ? "p-4" : "p-5 md:p-6"
      }`}
    >
      {onArchive ? (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onArchive(idea.id);
          }}
          className="absolute right-3 top-3 rounded-lg px-2 py-1 text-xs font-medium text-zinc-500 opacity-0 transition group-hover:opacity-100 hover:bg-zinc-100 hover:text-zinc-800"
        >
          Archive
        </button>
      ) : null}
      <Link href={`/chat/${idea.id}`} className="flex flex-1 flex-col gap-3">
        <h2 className={`font-semibold leading-snug ${compact ? "text-lg" : "text-xl md:text-2xl"}`}>
          {idea.businessName}
        </h2>
        <p className="line-clamp-3 text-sm leading-relaxed text-zinc-500/90 md:text-base">
          {idea.summary}
        </p>
        <footer className="mt-auto flex flex-wrap gap-x-4 gap-y-1 border-t border-zinc-100 pt-3 text-xs text-zinc-600 md:text-sm">
          <span>
            <span className="font-medium text-zinc-800">Date:</span>{" "}
            {formatDate(idea.lastChatAt)}
          </span>
          <span>
            <span className="font-medium text-zinc-800">Rating:</span> {idea.rating}
          </span>
          <span>
            <span className="font-medium text-zinc-800">Step:</span> {idea.step}
          </span>
        </footer>
      </Link>
    </article>
  );
}
