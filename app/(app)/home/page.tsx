"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Fab } from "@/components/Fab";
import { IdeaCard } from "@/components/IdeaCard";
import { setIdeaArchived } from "@/lib/storage";
import { useApp } from "@/lib/app-context";

export default function HomePage() {
  const { data, refresh } = useApp();
  const ideas = data.ideas.filter((i) => !i.archived);
  const compact = data.settings.compactCards;

  const stats = useMemo(() => {
    let strongCount = 0;
    ideas.forEach((i) => {
      const match = i.rating.match(/([0-9]+(?:\.[0-9]+)?)/);
      if (match && parseFloat(match[1]) >= 8.0) {
        strongCount++;
      } else if (i.rating.startsWith("A")) {
        strongCount++;
      }
    });
    return {
      total: ideas.length,
      strongCount,
    };
  }, [ideas]);

  return (
    <>
      <AppShell variant="home" greetingName={data.user?.displayName}>
        {data.settings.notifications ? (
          <div className="mb-5 flex items-center justify-between rounded-xl border border-emerald-200/90 bg-emerald-50/70 px-4 py-2.5 text-xs text-emerald-900 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                <strong>Strict Live Mode:</strong> Business analysis workflows stream in real-time from your local n8n agent.
              </span>
            </div>
            <Link
              href="/settings"
              className="font-medium underline hover:text-emerald-950"
            >
              Settings
            </Link>
          </div>
        ) : null}

        {/* Section Header with Stats Overview */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-200 pb-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900 md:text-xl">
                Business Feasibility Portfolio
              </h2>
              <p className="text-xs text-zinc-500">
                Active ventures analyzed and stress-tested with your AI advisor.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-lg bg-zinc-100 px-2.5 py-1 font-medium text-zinc-700">
                Total: <strong>{stats.total}</strong>
              </span>
              <span className="rounded-lg bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 font-medium text-emerald-800">
                High Viability: <strong>{stats.strongCount}</strong>
              </span>
            </div>
          </div>

          {ideas.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-xl">
                💡
              </div>
              <h3 className="text-base font-semibold text-zinc-800">
                No active business ideas yet
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Ready to stress-test your entrepreneurial idea? Tap the button below to run a complete viability check through n8n.
              </p>
              <div className="pt-2">
                <Link
                  href="/new-chat"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 transition"
                >
                  <span>+ Start New Business Analysis</span>
                </Link>
              </div>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {ideas.map((idea) => (
                <li key={idea.id}>
                  <IdeaCard
                    idea={idea}
                    compact={compact}
                    onArchive={(id) => {
                      setIdeaArchived(id, true);
                      refresh();
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </AppShell>
      <Fab />
    </>
  );
}
