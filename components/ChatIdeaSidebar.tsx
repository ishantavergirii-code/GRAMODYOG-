"use client";

import Link from "next/link";
import type { Idea } from "@/lib/types";

type ChatIdeaSidebarProps = {
  ideas: Idea[];
  activeId: string;
};

export function ChatIdeaSidebar({ ideas, activeId }: ChatIdeaSidebarProps) {
  return (
    <div className="flex h-full flex-col p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        Your ideas
      </p>
      <ul className="flex flex-col gap-1 overflow-y-auto">
        {ideas.map((idea) => {
          const active = idea.id === activeId;
          return (
            <li key={idea.id}>
              <Link
                href={`/chat/${idea.id}`}
                className={`block rounded-xl px-3 py-2.5 text-sm transition ${
                  active
                    ? "bg-zinc-900 font-medium text-white"
                    : "text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                <span className="line-clamp-2">{idea.businessName}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
