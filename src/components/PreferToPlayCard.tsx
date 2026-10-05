import { Card } from "@/components/ui/card";
import { PlayLink } from "@/components/SiteNav";

export function PreferToPlayCard() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <Card className="flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl font-bold tracking-[-0.03em] md:text-4xl">
            Prefer to play<span className="text-primary">?</span>
          </h2>
          <p className="mt-3 border-l-[6px] border-primary pl-4 text-muted-foreground">
            My career as a 2D, sidescroller RPG: walk through each job, open the cases as collectible cards, and fight the pandemics.
          </p>
        </div>
        <PlayLink label="Quest for the Next Product" variant="blue" className="h-11 shrink-0 px-6 text-base" />
      </Card>
    </section>
  );
}
