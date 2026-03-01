"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type ConsoleSettingsState = {
  testnetMode: boolean;
  setTestnetMode: (enabled: boolean) => void;
  toggleTestnetMode: () => void;
};

export const useConsoleSettings = create<ConsoleSettingsState>()(
  persist(
    (set) => ({
      testnetMode: true,
      setTestnetMode: (enabled) => set({ testnetMode: enabled }),
      toggleTestnetMode: () =>
        set((state) => ({ testnetMode: !state.testnetMode })),
    }),
    {
      name: "atlas-console-settings",
      storage:
        typeof window !== "undefined"
          ? createJSONStorage(() => localStorage)
          : undefined,
      version: 1,
    },
  ),
);
