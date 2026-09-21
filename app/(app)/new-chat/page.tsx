"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { createIdeaFromForm } from "@/lib/ideas-factory";
import { saveIdea } from "@/lib/storage";

export default function NewChatPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [investment, setInvestment] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const onDone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !investment.trim() || !location.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    const idea = createIdeaFromForm({
      businessName: businessName.trim(),
      investment: investment.trim(),
      location: location.trim(),
    });
    saveIdea(idea);
    router.push(`/chat/${idea.id}`);
  };

  return (
    <AppShell variant="back" title="New Chat">
      <div className="mx-auto w-full max-w-lg">
        <h2 className="text-xl font-semibold md:text-2xl">
          First tell us some things
        </h2>
        <form onSubmit={onDone} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-800">
              What business are you thinking?
            </label>
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Idea / Category"
              className="mt-2 min-h-12 w-full rounded-full border border-zinc-300 px-5 text-base outline-none focus:ring-2 focus:ring-zinc-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-800">
              How much are you willing to invest?
            </label>
            <input
              value={investment}
              onChange={(e) => setInvestment(e.target.value)}
              placeholder="₹ XX, XX, XXX"
              className="mt-2 min-h-12 w-full rounded-full border border-zinc-300 px-5 text-base outline-none focus:ring-2 focus:ring-zinc-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-800">
              Finally, what location are you planning?
            </label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, area"
              className="mt-2 min-h-12 w-full rounded-full border border-zinc-300 px-5 text-base outline-none focus:ring-2 focus:ring-zinc-400"
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            type="submit"
            className="min-h-12 w-full rounded-full bg-zinc-900 text-base font-semibold text-white hover:bg-zinc-800"
          >
            Done
          </button>
        </form>
      </div>
    </AppShell>
  );
}
