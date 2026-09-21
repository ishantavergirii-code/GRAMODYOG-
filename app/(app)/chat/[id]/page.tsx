"use client";

import { useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ChatIdeaSidebar } from "@/components/ChatIdeaSidebar";
import { ChatThread } from "@/components/ChatThread";
import { useApp } from "@/lib/app-context";
import Link from "next/link";

export default function ChatPage() {
  const params = useParams();
  const id = params.id as string;
  const { data, refresh } = useApp();
  const idea = data.ideas.find((i) => i.id === id);
  const activeIdeas = data.ideas.filter((i) => !i.archived);

  if (!idea) {
    return (
      <AppShell variant="back" title="Chat">
        <p className="text-zinc-600">
          Idea not found.{" "}
          <Link href="/home" className="font-medium underline">
            Back to home
          </Link>
        </p>
      </AppShell>
    );
  }

  return (
    <AppShell
      variant="back"
      title={idea.businessName}
      sidePanel={<ChatIdeaSidebar ideas={activeIdeas} activeId={id} />}
    >
      <div className="flex min-h-[calc(100dvh-8rem)] flex-col">
        <ChatThread idea={idea} onUpdate={refresh} />
      </div>
    </AppShell>
  );
}
