import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const THEME_OPTIONS = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const resolved =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  return (
    <div className="inline-flex items-center rounded-full border border-border bg-muted/50 p-1">
      {THEME_OPTIONS.map((option) => {
        const isActive = resolved === option.value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            aria-label={`Switch to ${option.label} theme`}
            aria-pressed={isActive}
            data-cursor-action="theme-toggle"
            className={`relative inline-flex size-8 items-center justify-center rounded-full transition-colors duration-200 ${
              isActive
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="theme-active"
                className="absolute inset-0 rounded-full bg-foreground"
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
              />
            )}
            <motion.span
              animate={isActive ? { scale: 1, rotate: 0 } : { scale: 0.9, rotate: -10 }}
              transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              <Icon className="size-4" />
            </motion.span>
          </button>
        );
      })}
    </div>
  );
}
