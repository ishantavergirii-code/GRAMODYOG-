"use client";

import Link from "next/link";
import type { Idea } from "@/lib/types";
import { getRatingColor } from "@/lib/rating-helper";

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
  const ratingStyle = getRatingColor(idea.rating);

  return (
    <article
      className={`group relative flex flex-col rounded-2xl border border-zinc-200/90 bg-white shadow-xs transition hover:border-zinc-300 hover:shadow-md ${
        compact ? "p-4" : "p-5 md:p-6"
      }`}
    >
      {/* Archive Button - Clearly visible on mobile (opacity-100), reveals on hover on desktop */}
      {onArchive ? (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onArchive(idea.id);
          }}
          aria-label="Archive idea"
          title="Archive this idea"
          className="absolute right-3.5 top-3.5 z-10 flex items-center gap-1 rounded-lg border border-zinc-200/90 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600 shadow-2xs opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900 transition"
        >
          <svg
            className="h-3.5 w-3.5 text-zinc-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="21 8 21 21 3 21 3 8" />
            <rect x="1" y="3" width="22" height="5" />
            <line x1="10" y1="12" x2="14" y2="12" />
          </svg>
          <span className="text-[11px]">Archive</span>
        </button>
      ) : null}

      <Link href={`/chat/${idea.id}`} className="flex flex-1 flex-col gap-3">
        {/* Header with Title and Rating Badge */}
        <div className="flex items-start justify-between gap-3 pr-16 sm:pr-20">
          <h2
            className={`font-semibold tracking-tight text-zinc-900 leading-snug ${
              compact ? "text-base" : "text-lg md:text-xl"
            }`}
          >
            {idea.businessName}
          </h2>
        </div>

        {/* Customized Parameters: Location & Capital */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {idea.location && (
            <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 font-medium text-zinc-700">
              <span>📍</span>
              <span className="truncate max-w-[140px]">{idea.location}</span>
            </span>
          )}
          {idea.investment && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 font-medium text-emerald-800 border border-emerald-100">
              <span>💰</span>
              <span>{idea.investment}</span>
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-semibold text-xs border ${ratingStyle.bg} ${ratingStyle.text} ${ratingStyle.border}`}
          >
            <span>★</span>
            <span>{idea.rating}</span>
          </span>
        </div>

        {/* Business Summary */}
        <p className="line-clamp-3 text-xs leading-relaxed text-zinc-600 md:text-sm">
          {idea.summary}
        </p>

        {/* Footer with Step & Activity Date */}
        <footer className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-3 text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400">Stage:</span>
            <span className="font-semibold text-zinc-800">{idea.step}</span>
          </div>
          <div>
            <span className="text-zinc-400">Updated:</span>{" "}
            <span className="font-medium text-zinc-700">
              {formatDate(idea.lastChatAt)}
            </span>
          </div>
        </footer>
      </Link>
    </article>
  );
}
