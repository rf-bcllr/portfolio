import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";

interface TogglesCardProps {
  language: "pt" | "en";
  onLanguageChange: (lang: "pt" | "en") => void;
}

export function TogglesCard({ language, onLanguageChange }: TogglesCardProps) {
  return (
    <div className="flex h-full items-center justify-center gap-2 p-4">
      <LanguageToggle language={language} onLanguageChange={onLanguageChange} />
      <ThemeToggle />
    </div>
  );
}
