import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "@/hooks/useTranslations";
import avatar from "@/assets/rafael-bacellar-avatar.jpg";

interface ProfileCardProps {
  language: "pt" | "en";
}

export function ProfileCard({ language }: ProfileCardProps) {
  const t = useTranslations(language);
  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center md:p-8">
      <div className="relative">
        <img
          src={avatar}
          alt={language === "pt" ? "Retrato de Rafael Bacellar" : "Portrait of Rafael Bacellar"}
          width={200}
          height={200}
          className="mx-auto size-36 rounded-full border-2 border-border object-cover shadow-lg md:size-44"
        />
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight md:text-3xl">Rafael Bacellar</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground md:text-base">
        {t.heroDescription}
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {t.skills.map((s: string) => (
          <Badge key={s} variant="secondary">
            {s}
          </Badge>
        ))}
      </div>
      <div className="mt-6">
        <Button asChild variant="contrast">
          <a href="https://linkedin.com/in/rfbcllr" target="_blank" rel="noreferrer">
            {t.talkOnLinkedIn}
          </a>
        </Button>
      </div>
    </div>
  );
}
