import { DEFAULT_SETTINGS, type AppData, type Idea, type Settings, type User } from "./types";
import { getStorageKey } from "./storage-key";

const emptyData = (): AppData => ({
  user: null,
  ideas: [],
  settings: { ...DEFAULT_SETTINGS },
  lastEmail: "",
});

function readRaw(): AppData {
  if (typeof window === "undefined") return emptyData();
  try {
    const raw = localStorage.getItem(getStorageKey());
    if (!raw) return emptyData();
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return {
      user: parsed.user ?? null,
      ideas: parsed.ideas ?? [],
      settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
      lastEmail: parsed.lastEmail ?? "",
    };
  } catch {
    return emptyData();
  }
}

function writeRaw(data: AppData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(getStorageKey(), JSON.stringify(data));
}

export function getAppData(): AppData {
  return readRaw();
}

export function saveAppData(data: AppData): void {
  writeRaw(data);
}

export function isAuthenticated(): boolean {
  return readRaw().user !== null;
}

export function signIn(email: string, password: string): User {
  void password;
  const localPart = email.split("@")[0] ?? "friend";
  const displayName =
    localPart.charAt(0).toUpperCase() + localPart.slice(1).replace(/[._-]/g, " ");
  const user: User = { email, displayName };
  const data = readRaw();
  data.user = user;
  data.lastEmail = email;
  if (data.ideas.length === 0) {
    data.ideas = seedIdeas();
  }
  writeRaw(data);
  return user;
}

export function signOut(): void {
  const data = readRaw();
  data.user = null;
  writeRaw(data);
}

export function updateUser(partial: Partial<User>): User | null {
  const data = readRaw();
  if (!data.user) return null;
  data.user = { ...data.user, ...partial };
  writeRaw(data);
  return data.user;
}

export function getSettings(): Settings {
  return readRaw().settings;
}

export function updateSettings(partial: Partial<Settings>): Settings {
  const data = readRaw();
  data.settings = { ...data.settings, ...partial };
  writeRaw(data);
  return data.settings;
}

export function getIdeas(includeArchived = false): Idea[] {
  const ideas = readRaw().ideas;
  if (includeArchived) return ideas;
  return ideas.filter((i) => !i.archived);
}

export function getArchivedIdeas(): Idea[] {
  return readRaw().ideas.filter((i) => i.archived);
}

export function getIdeaById(id: string): Idea | undefined {
  return readRaw().ideas.find((i) => i.id === id);
}

export function saveIdea(idea: Idea): void {
  const data = readRaw();
  const idx = data.ideas.findIndex((i) => i.id === idea.id);
  if (idx >= 0) data.ideas[idx] = idea;
  else data.ideas.unshift(idea);
  writeRaw(data);
}

export function setIdeaArchived(id: string, archived: boolean): void {
  const data = readRaw();
  const idea = data.ideas.find((i) => i.id === id);
  if (!idea) return;
  idea.archived = archived;
  writeRaw(data);
}

function seedIdeas(): Idea[] {
  const now = new Date().toISOString();
  const dayAgo = new Date(Date.now() - 86400000).toISOString();
  const weekAgo = new Date(Date.now() - 86400000 * 5).toISOString();

  return [
    {
      id: "seed-1",
      businessName: "Cloud Kitchen — South Indian",
      investment: "₹ 8,00,000",
      location: "Bengaluru, Koramangala",
      summary:
        "Focus on office lunch subscriptions and Swiggy/Zomato with a tight 12-item menu. Strong demand in your pin code.",
      rating: "8.1/10",
      step: "Validation",
      lastChatAt: dayAgo,
      archived: false,
      messages: [
        {
          id: "m1",
          role: "bot",
          text: "Your cloud kitchen idea fits Koramangala well. Next, validate average order value with 20 customer interviews.",
          at: dayAgo,
        },
      ],
    },
    {
      id: "seed-2",
      businessName: "EV Battery Swap Station",
      investment: "₹ 25,00,000",
      location: "Pune, Hinjawadi",
      summary:
        "Target delivery fleets first; partner with one OEM for standardized packs. Capex is high but utilization can ramp quickly.",
      rating: "B+",
      step: "Discovery",
      lastChatAt: weekAgo,
      archived: false,
      messages: [
        {
          id: "m2",
          role: "bot",
          text: "Hinjawadi has fleet density worth mapping. I recommend a 90-day pilot with one delivery partner before buying extra inventory.",
          at: weekAgo,
        },
      ],
    },
    {
      id: "seed-3",
      businessName: "Boutique Co-working",
      investment: "₹ 15,00,000",
      location: "Hyderabad, Gachibowli",
      summary:
        "Niche around 8–12 seat private studios for early startups. Differentiate with recording pods and founder office hours.",
      rating: "7.4/10",
      step: "Planning",
      lastChatAt: now,
      archived: false,
      messages: [
        {
          id: "m3",
          role: "bot",
          text: "Gachibowli pricing supports premium micro-offices. Survey 15 founders on willingness to pay for a 6-seat studio.",
          at: now,
        },
      ],
    },
  ];
}
