import { Card } from "@/components/ui/card";
import { PlayLink } from "@/components/SiteNav";

export function PreferToPlayCard({
  title,
  buttonLabel = "Play this portfolio",
}: {
  title?: string;
  buttonLabel?: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-12 pb-[104px] md:pt-2">
      <Card className="flex flex-col items-start justify-between gap-4 p-4 sm:p-5 lg:flex-row lg:items-center">
        <div className="max-w-xl lg:flex-1">
          <h2 className="font-display text-2xl font-bold tracking-normal md:text-3xl">
            {title ?? (
              <>
                Prefer to play<span className="text-primary">?</span>
              </>
            )}
          </h2>
          <p className="mt-2 border-l-[6px] border-primary pl-3 text-sm text-muted-foreground">
            My career as a 2D, sidescroller RPG: walk through each job, open the cases as collectible cards, and fight the pandemics.
          </p>
        </div>
        <div className="flex w-full min-w-0 items-center lg:w-auto lg:shrink-0">
          <PlayLink label={buttonLabel} variant="blue" className="h-auto min-h-10 max-w-full px-3 py-1.5 text-center text-sm whitespace-normal sm:px-4" />
        </div>
      </Card>
    </section>
  );
}
