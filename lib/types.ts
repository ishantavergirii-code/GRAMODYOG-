export type User = {
  email: string;
  displayName: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "bot";
  text: string;
  at: string;
};

export type Idea = {
  id: string;
  businessName: string;
  investment: string;
  location: string;
  summary: string;
  rating: string;
  step: string;
  lastChatAt: string;
  archived: boolean;
  messages: ChatMessage[];
};

export type Settings = {
  notifications: boolean;
  compactCards: boolean;
};

export type AppData = {
  user: User | null;
  ideas: Idea[];
  settings: Settings;
  lastEmail: string;
};

export const DEFAULT_SETTINGS: Settings = {
  notifications: true,
  compactCards: false,
};
