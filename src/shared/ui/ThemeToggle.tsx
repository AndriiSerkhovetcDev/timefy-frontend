import { useThemeStore } from "@/shared/model/themeStore";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const { isDark, toggle } = useThemeStore();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Увімкнути світлу тему" : "Увімкнути темну тему"}
      title={isDark ? "Світла тема" : "Темна тема"}
      className="cursor-pointer rounded-lg border border-border p-2 text-text-muted transition hover:bg-bg-input hover:text-text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  );
};
