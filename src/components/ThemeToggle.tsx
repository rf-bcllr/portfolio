import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const THEME_OPTIONS = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex items-center rounded-full border border-border bg-muted/50 p-1">
      {THEME_OPTIONS.map((option) => {
        const isActive = theme === option.value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            aria-label={`Switch to ${option.label} theme`}
            aria-pressed={isActive}
            data-cursor-action="theme-toggle"
            className={`relative inline-flex size-8 items-center justify-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              isActive ? "text-background" : "text-muted-foreground hover:text-foreground"
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
              className="relative z-10"
              initial={false}
              animate={
                isActive
                  ? { scale: 1, opacity: 1, y: 0 }
                  : { scale: 0.85, opacity: 0.6, y: 0 }
              }
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
            >
              <motion.div
                initial={false}
                animate={
                  isActive
                    ? { rotate: option.value === "light" ? 180 : 0, scale: 1 }
                    : { rotate: 0, scale: 1 }
                }
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                <Icon className="size-4" />
              </motion.div>
            </motion.span>
          </button>
        );
      })}
    </div>
  );
}
