import { initialBotMessage, randomRating } from "./bot";
import type { Idea } from "./types";

export function createIdeaFromForm(fields: {
  businessName: string;
  investment: string;
  location: string;
}): Idea {
  const now = new Date().toISOString();
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `idea-${Date.now()}`;

  const botText = initialBotMessage(
    fields.businessName,
    fields.investment,
    fields.location,
  );

  return {
    id,
    businessName: fields.businessName,
    investment: fields.investment,
    location: fields.location,
    summary: botText.replace(/\*\*/g, "").slice(0, 120) + "…",
    rating: randomRating(),
    step: "Discovery",
    lastChatAt: now,
    archived: false,
    messages: [
      {
        id: `msg-${Date.now()}`,
        role: "bot",
        text: botText.replace(/\*\*/g, ""),
        at: now,
      },
    ],
  };
}
