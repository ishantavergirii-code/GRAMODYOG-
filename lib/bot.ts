const SUGGESTIONS = [
  "What are the main risks?",
  "Help me with next steps",
  "Compare with competitors",
  "Estimate monthly revenue",
];

export function getSuggestionPills(): string[] {
  return SUGGESTIONS;
}

export function mockBotReply(userText: string, ideaName: string): string {
  const t = userText.toLowerCase();
  if (t.includes("risk")) {
    return `For ${ideaName}, watch regulatory changes, customer acquisition cost, and supply chain delays. Mitigate with phased rollout and a 3-month cash buffer.`;
  }
  if (t.includes("next") || t.includes("step")) {
    return `Next for ${ideaName}: (1) talk to 10 target customers this week, (2) draft a one-page unit economics sheet, (3) run a ₹5k ad test in your location.`;
  }
  if (t.includes("compet")) {
    return `Map 5 direct competitors for ${ideaName} within 5 km. Note their pricing, reviews, and gaps — especially speed, quality, and trust signals you can beat.`;
  }
  if (t.includes("revenue") || t.includes("earn")) {
    return `Rough model for ${ideaName}: estimate daily customers × average ticket × open days. Share your assumptions and we can tighten the forecast.`;
  }
  return `Got it. For ${ideaName}, I'd prioritize validating demand in ${"your chosen location"} before scaling spend. What constraint matters most — budget, time, or team?`;
}

export function initialBotMessage(
  businessName: string,
  investment: string,
  location: string,
): string {
  return `Thanks for sharing! You're exploring **${businessName}** with a budget around ${investment} in ${location}. I'll help you stress-test the idea, spot risks, and plan next steps. What's your biggest question right now?`;
}

export function randomRating(): string {
  const ratings = ["7.2/10", "7.8/10", "8.1/10", "B+", "A-", "B"];
  return ratings[Math.floor(Math.random() * ratings.length)]!;
}
