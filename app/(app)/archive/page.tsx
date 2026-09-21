"use client";

import { AppShell } from "@/components/AppShell";
import { IdeaCard } from "@/components/IdeaCard";
import { setIdeaArchived } from "@/lib/storage";
import { useApp } from "@/lib/app-context";

export default function ArchivePage() {
  const { data, refresh } = useApp();
  const archived = data.ideas.filter((i) => i.archived);

  return (
    <AppShell variant="back" title="Archive">
      {archived.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-600">
          No archived ideas. Archive from the home screen card menu.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {archived.map((idea) => (
            <li key={idea.id} className="relative">
              <IdeaCard idea={idea} compact={data.settings.compactCards} />
              <button
                type="button"
                onClick={() => {
                  setIdeaArchived(idea.id, false);
                  refresh();
                }}
                className="absolute bottom-5 right-5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold shadow ring-1 ring-zinc-200 hover:bg-zinc-50"
              >
                Restore
              </button>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
