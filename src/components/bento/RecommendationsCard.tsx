import { Card } from "@/components/ui/card";
import { useTranslations } from "@/hooks/useTranslations";

interface RecommendationsCardProps {
  language: "pt" | "en";
}

export function RecommendationsCard({ language }: RecommendationsCardProps) {
  const t = useTranslations(language);
  const quotes = t.recommendations as { quote: string; author: string }[];

  return (
    <Card className="h-full p-6">
      {quotes.map((q, idx) => (
        <div key={idx} className={idx > 0 ? "mt-6" : undefined}>
          {idx > 0 && <div className="mb-6 h-px w-full bg-border" />}
          <p className="text-sm text-muted-foreground">“{q.quote}”</p>
          <p className="mt-3 font-medium">{q.author}</p>
        </div>
      ))}
    </Card>
  );
}

