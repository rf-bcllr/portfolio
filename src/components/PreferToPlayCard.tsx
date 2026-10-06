import { Card } from "@/components/ui/card";
import { PlayLink } from "@/components/SiteNav";
import questLogo from "@/assets/quest-logo.png.asset.json";

export function PreferToPlayCard({
  title,
  buttonLabel = "Quest for the Next Product",
}: {
  title?: string;
  buttonLabel?: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-8 pt-24">
      <Card className="flex flex-col items-start justify-between gap-8 p-6 sm:p-8 lg:flex-row lg:items-center">
        <div className="max-w-xl lg:flex-1">
          <h2 className="font-display text-3xl font-bold tracking-normal md:text-4xl">
            {title ?? (
              <>
                Prefer to play<span className="text-primary">?</span>
              </>
            )}
          </h2>
          <p className="mt-3 border-l-[6px] border-primary pl-4 text-muted-foreground">
            My career as a 2D, sidescroller RPG: walk through each job, open the cases as collectible cards, and fight the pandemics.
          </p>
        </div>
        <div className="flex w-full min-w-0 flex-col items-center gap-6 lg:w-80 lg:shrink-0">
          <img
            src={questLogo.url}
            alt="End-to-End Quest for the Next Product"
            width={1774}
            height={887}
            loading="lazy"
            className="-mt-12 h-auto w-[115%] max-w-none object-contain sm:-mt-14 lg:-mt-20 lg:w-[130%] lg:translate-x-8"
          />
          <PlayLink label={buttonLabel} variant="blue" className="h-auto min-h-11 max-w-full px-4 py-3 text-center text-sm whitespace-normal sm:px-6 sm:text-base" />
        </div>
      </Card>
    </section>
  );
}
