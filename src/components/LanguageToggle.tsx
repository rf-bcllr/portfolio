import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

interface LanguageToggleProps {
  language: "pt" | "en";
  onLanguageChange: (lang: "pt" | "en") => void;
}

export function LanguageToggle({ language, onLanguageChange }: LanguageToggleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onLanguageChange(language === "pt" ? "en" : "pt")}
      className="h-9 px-3 gap-2"
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm font-medium">
        {language === "pt" ? "EN" : "PT"}
      </span>
    </Button>
  );
}