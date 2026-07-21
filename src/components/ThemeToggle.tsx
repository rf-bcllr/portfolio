import { Moon, Sun } from "lucide-react";
import { DuneIcon } from "@/components/DuneIcon";
import { useTheme, type Theme } from "@/components/ThemeProvider";

const ORDER: Theme[] = ["light", "dune", "dark"];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const current = ORDER.includes(theme as Theme) ? (theme as Theme) : "light";
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];

  const Icon = current === "light" ? Sun : current === "dune" ? DuneIcon : Moon;
  const label = `Switch to ${next} theme (current: ${current})`;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={label}
      title={label}
      data-cursor-action="theme-toggle"
      data-theme={current}
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-transparent text-foreground transition-colors hover:border-primary hover:text-primary"
    >
      <Icon className="size-4" />
    </button>
  );
}
