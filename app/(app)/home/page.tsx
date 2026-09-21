"use client";

import { AppShell } from "@/components/AppShell";
import { Fab } from "@/components/Fab";
import { IdeaCard } from "@/components/IdeaCard";
import { setIdeaArchived } from "@/lib/storage";
import { useApp } from "@/lib/app-context";

export default function HomePage() {
  const { data, refresh } = useApp();
  const ideas = data.ideas.filter((i) => !i.archived);
  const compact = data.settings.compactCards;

  return (
    <>
      <AppShell variant="home" greetingName={data.user?.displayName}>
        {data.settings.notifications ? (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            Notifications are on — you&apos;ll see tips here on the home screen (demo).
          </div>
        ) : null}
        <section>
          <h2 className="text-base font-medium text-zinc-700 md:text-lg">
            Recent business ideas we&apos;ve been working on
          </h2>
          {ideas.length === 0 ? (
            <p className="mt-6 rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-600">
              No active ideas yet. Tap + to start a new chat.
            </p>
          ) : (
            <ul className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
