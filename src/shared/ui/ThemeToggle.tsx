import { useThemeStore } from "@/shared/model/themeStore";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const { isDark, toggle } = useThemeStore();

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg border border-border text-text-muted hover:bg-bg-input transition cursor-pointer"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};
