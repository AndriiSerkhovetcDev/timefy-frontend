import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import { create } from "zustand/react";

interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
}

const applyTheme = (isDark: boolean) => {
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
};

const getSystemPreference = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

const storage: StateStorage = {
  getItem: (name) => {
    const value = localStorage.getItem(name);

    if (!value) return null;

    try {
      JSON.parse(value);
      return value;
    } catch {
      localStorage.removeItem(name);
      return null;
    }
  },
  setItem: (name, value) => localStorage.setItem(name, value),
  removeItem: (name) => localStorage.removeItem(name),
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: getSystemPreference(),
      toggle: () =>
        set((state) => {
          const next = !state.isDark;
          applyTheme(next);
          return { isDark: next };
        }),
    }),
    {
      name: "theme",
      storage: createJSONStorage(() => storage),
      onRehydrateStorage: () => (state) => applyTheme(state?.isDark ?? getSystemPreference()),
    },
  ),
);

export const initializeTheme = () => applyTheme(useThemeStore.getState().isDark);
