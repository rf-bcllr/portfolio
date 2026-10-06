import { Card } from "@/components/ui/card";
import { PlayLink } from "@/components/SiteNav";
import questLogo from "@/assets/quest-logo.png.asset.json";

export function PreferToPlayCard({
  title,
  buttonLabel = "Play this portfolio",
}: {
  title?: string;
  buttonLabel?: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-8 pt-16">
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
        <div className="flex w-full min-w-0 flex-col items-center gap-2 lg:w-72 lg:shrink-0">
          <img
            src={questLogo.url}
            alt="End-to-End Quest for the Next Product"
            width={1774}
            height={887}
            loading="lazy"
            className="-mt-10 h-auto w-[110%] max-w-none object-contain sm:-mt-12 lg:-mt-16 lg:w-[125%] lg:translate-x-0"
          />
          <PlayLink label={buttonLabel} variant="blue" className="h-auto min-h-10 max-w-full px-3 py-1.5 text-center text-sm whitespace-normal sm:px-4" />
        </div>
      </Card>
    </section>
  );
}
