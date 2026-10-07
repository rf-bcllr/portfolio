import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const THEME_OPTIONS = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
] as const;

/**
 * Self-contained toggle: the active pill is a local CSS-transitioned element
 * (no shared framer `layoutId`), so multiple instances (desktop + mobile) and
 * page remounts at different scroll offsets can never make it fly or vanish.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const activeIndex = theme === "dark" ? 1 : 0;

  return (
    <div className="relative inline-flex items-center rounded-full border border-border bg-muted/50 p-1">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1 top-1 size-8 rounded-full bg-foreground transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {THEME_OPTIONS.map((option, i) => {
        const isActive = i === activeIndex;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            aria-label={`Switch to ${option.label} theme`}
            aria-pressed={isActive}
            data-cursor-action="theme-toggle"
            className={`relative z-10 inline-flex size-8 items-center justify-center rounded-full transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              isActive ? "text-background" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon aria-hidden="true" className="size-4" />
          </button>
        );
      })}
    </div>
  );
}
