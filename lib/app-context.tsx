"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getAppData,
  saveAppData,
  signIn as storageSignIn,
  signOut as storageSignOut,
  updateSettings as storageUpdateSettings,
  updateUser as storageUpdateUser,
} from "./storage";
import type { AppData, Idea, Settings, User } from "./types";

type AppContextValue = {
  ready: boolean;
  data: AppData;
  refresh: () => void;
  signIn: (email: string, password: string) => User;
  signOut: () => void;
  updateUser: (partial: Partial<User>) => void;
  updateSettings: (partial: Partial<Settings>) => void;
  persistIdeas: (ideas: Idea[]) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<AppData>(() => getAppData());

  const refresh = useCallback(() => {
    setData(getAppData());
  }, []);

  useEffect(() => {
    setData(getAppData());
    setReady(true);
  }, []);

  const signIn = useCallback(
    (email: string, password: string) => {
      const user = storageSignIn(email, password);
      refresh();
      return user;
    },
    [refresh],
  );

  const signOut = useCallback(() => {
    storageSignOut();
    refresh();
  }, [refresh]);

  const updateUser = useCallback(
    (partial: Partial<User>) => {
      storageUpdateUser(partial);
      refresh();
    },
    [refresh],
  );

  const updateSettings = useCallback(
    (partial: Partial<Settings>) => {
      storageUpdateSettings(partial);
      refresh();
    },
    [refresh],
  );

  const persistIdeas = useCallback(
    (ideas: Idea[]) => {
      const next = { ...getAppData(), ideas };
      saveAppData(next);
      refresh();
    },
    [refresh],
  );

  const value = useMemo(
    () => ({
      ready,
      data,
      refresh,
      signIn,
      signOut,
      updateUser,
      updateSettings,
      persistIdeas,
    }),
    [ready, data, refresh, signIn, signOut, updateUser, updateSettings, persistIdeas],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
