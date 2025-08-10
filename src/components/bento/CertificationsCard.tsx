import { Card } from "@/components/ui/card";
import { useTranslations } from "@/hooks/useTranslations";

interface Certification {
  name: string;
  href: string;
}

interface CertificationsCardProps {
  items: Certification[];
  language?: "pt" | "en";
}

export function CertificationsCard({ items, language = "pt" }: CertificationsCardProps) {
  const t = useTranslations(language);
  return (
    <Card className="h-full p-6">
      <h3 className="text-lg font-semibold">{t.certificationsTitle}</h3>
      <ul className="mt-4 space-y-2 text-sm">
        {items.map((c) => (
          <li key={c.href}>
            <a href={c.href} target="_blank" rel="noreferrer" className="story-link">
              {c.name}
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}
