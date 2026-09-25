import type { Idea } from "./types";
import { deriveRatingAndStep } from "./rating-helper";

export function createIdeaFromForm(fields: {
  businessName: string;
  investment: string;
  location: string;
  initialPrompt?: string;
  initialResponse?: string;
  customId?: string;
}): Idea {
  const now = new Date().toISOString();
  const id =
    fields.customId ||
    (typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `idea-${Date.now()}`);

  const promptText =
    fields.initialPrompt ||
    `I want to open a ${fields.businessName} in ${fields.location} with ${fields.investment} capital. Please provide a detailed feasibility analysis, key operational risks, and recommended immediate next steps.`;

  const messages: Idea["messages"] = [
    {
      id: `u-${Date.now()}`,
      role: "user",
      text: promptText,
      at: now,
    },
  ];

  if (fields.initialResponse) {
    messages.push({
      id: `b-${Date.now() + 1}`,
      role: "bot",
      text: fields.initialResponse,
      at: new Date().toISOString(),
    });
  }

  const cleanSummary = fields.initialResponse
    ? fields.initialResponse.replace(/[#*`_]/g, "").slice(0, 130) + "…"
    : `Exploring ${fields.businessName} with ${fields.investment} in ${fields.location}`;

  const { rating, step } = deriveRatingAndStep(fields.initialResponse);

  return {
    id,
    businessName: fields.businessName,
    investment: fields.investment,
    location: fields.location,
    summary: cleanSummary,
    rating,
    step,
    lastChatAt: now,
    archived: false,
    messages,
  };
}
