import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MediaThumb } from "@/components/MediaThumb";
import type { FeaturedProject } from "@/data/featuredProjects";

interface WorkProjectCardProps {
  project: FeaturedProject;
  index?: number;
  compact?: boolean;
}

const accentClassMap: Record<FeaturedProject["accent"], string> = {
  blue: "project-card-blue",
  green: "project-card-green",
  amber: "project-card-amber",
  red: "project-card-red",
};

const prefetchMedia = (item?: FeaturedProject["mediaItems"][number]) => {
  if (!item) return;

  if (item.poster) {
    const posterImage = new Image();
    posterImage.decoding = "async";
    posterImage.src = item.poster;
  }

  if (item.src) {
    const image = new Image();
    image.decoding = "async";
    image.src = item.src;
  }

  if (item.sources?.length) {
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;

    item.sources.forEach((source) => {
      const sourceElement = document.createElement("source");
      sourceElement.src = source.src;
      sourceElement.type = source.type;
      video.appendChild(sourceElement);
    });

    video.load();
  }
};

export function WorkProjectCard({ project, index = 0, compact = false }: WorkProjectCardProps) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const mediaItems = project.mediaItems.length > 0 ? project.mediaItems : [{
    title: project.title,
    sources: project.media?.sources,
    poster: project.poster,
    src: project.media ? undefined : project.poster,
    orientation: project.mediaPresentation.orientation,
    presentation: project.mediaPresentation,
  }];
  const activeMedia = mediaItems[activeMediaIndex] ?? mediaItems[0];
  const activePresentation = activeMedia.presentation;
  const isPhoneFrame = activePresentation.frame === "phone";
  const hasMultipleMedia = mediaItems.length > 1;
  const mediaAreaHeight = isPhoneFrame ? "min-h-[560px]" : activeMedia.orientation === "square" || activePresentation.aspect === "aspect-[1972/1616]" ? "min-h-[520px]" : "min-h-[430px]";
  const mediaFitClass = isPhoneFrame ? "object-contain" : "object-cover";
  const activeMediaKey = activeMedia.sources?.map((source) => source.src).join("|") ?? activeMedia.src ?? activeMedia.poster ?? activeMedia.title;
  const nextMediaIndex = hasMultipleMedia ? (activeMediaIndex + 1) % mediaItems.length : activeMediaIndex;
  const previousMediaIndex = hasMultipleMedia ? (activeMediaIndex - 1 + mediaItems.length) % mediaItems.length : activeMediaIndex;
  const rotation = index % 2 === 0 ? "-0.25deg" : "0.25deg";

  useEffect(() => {
    if (!hasMultipleMedia) return;

    prefetchMedia(mediaItems[nextMediaIndex]);
  }, [hasMultipleMedia, mediaItems, nextMediaIndex]);

  const showPrevious = () => setActiveMediaIndex((current) => (current - 1 + mediaItems.length) % mediaItems.length);
  const showNext = () => setActiveMediaIndex((current) => (current + 1) % mediaItems.length);

  return (
    <article
      className={`group relative block overflow-hidden rounded-[24px] border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--project-accent-border))] hover:shadow-card-hover ${accentClassMap[project.accent]}`}
      style={{ transform: `rotate(${rotation})` }}
    >
      <div className={`grid ${compact ? "" : "lg:grid-cols-[minmax(0,0.9fr)_minmax(440px,0.92fr)] xl:grid-cols-[minmax(0,0.82fr)_minmax(560px,1fr)]"}`}>
        <div className="relative flex flex-col justify-between gap-7 p-6 md:p-8 lg:p-9">
          <span className="absolute inset-y-0 left-0 w-1.5 bg-[hsl(var(--project-accent))]" aria-hidden />
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {project.chips.map((chip) => (
                <Badge
                  key={chip}
                  variant="outline"
                  className="rounded-full border-[hsl(var(--project-accent-border))] bg-[hsl(var(--project-accent-bg))] px-3 py-1 text-[hsl(var(--project-accent))]"
                >
                  {chip}
                </Badge>
              ))}
            </div>
            <h3 className="font-display text-3xl font-semibold leading-tight md:text-4xl">{project.title}</h3>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">{project.category}</p>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-[17px]">{project.summary}</p>
          </div>

          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-[18px] border border-border bg-secondary/60 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Timeline</p>
              <p className="mt-1.5 text-[15px] font-semibold leading-snug text-foreground">{project.durationDisplay}</p>
            </div>
            <div className="rounded-[18px] border border-border bg-secondary/60 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Role</p>
              <p className="mt-1.5 text-[15px] font-semibold leading-snug text-foreground">{project.roleDisplay}</p>
            </div>
            <div className="rounded-[18px] border border-[hsl(var(--project-accent-border))] bg-[hsl(var(--project-accent-bg))] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Signal</p>
              <p className="mt-1.5 text-[15px] font-semibold leading-snug text-[hsl(var(--project-accent))]">{project.outcome}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.outcomeHighlights.map((item) => (
              <span key={item} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className={`relative flex items-center justify-center overflow-hidden border-t border-[hsl(var(--project-accent-border))] bg-[hsl(var(--project-accent-bg))] p-7 md:p-10 lg:border-l lg:border-t-0 ${mediaAreaHeight}`}>
          <div className="absolute right-5 top-6 hidden text-4xl opacity-80 md:block" aria-hidden>
            {project.emoji}
          </div>
          <div
            className={`relative w-full transition-all duration-300 ${activePresentation.maxWidth} ${activePresentation.rotate ?? ""}`}
          >
            <div className={`relative overflow-hidden border border-[hsl(var(--project-accent-border))] bg-card shadow-card-hover ${isPhoneFrame ? "rounded-[34px] p-3 before:absolute before:left-1/2 before:top-3 before:z-10 before:h-1.5 before:w-16 before:-translate-x-1/2 before:rounded-full before:bg-foreground/25" : "rounded-[24px] p-2.5 pt-9 before:absolute before:left-5 before:top-4 before:size-2 before:rounded-full before:bg-muted-foreground/35 after:absolute after:left-9 after:top-4 after:size-2 after:rounded-full after:bg-muted-foreground/25"}`}>
              {!isPhoneFrame && <span className="absolute left-[52px] top-4 size-2 rounded-full bg-muted-foreground/20" aria-hidden />}
              <div className={`w-full overflow-hidden bg-secondary ${activePresentation.aspect} ${isPhoneFrame ? "rounded-[24px]" : "rounded-[16px]"}`}>
              <MediaThumb
                key={activeMediaKey}
                sources={activeMedia.sources}
                poster={activeMedia.poster}
                src={activeMedia.sources ? undefined : activeMedia.src ?? activeMedia.poster}
                alt={activeMedia.title}
                className={`size-full ${mediaFitClass} transition-transform duration-500 group-hover:scale-[1.025]`}
                priority={index === 0}
                showSkeleton
              />
              </div>
            </div>
          </div>
          {hasMultipleMedia && (
            <div className="pointer-events-none absolute inset-x-5 bottom-5 flex items-center justify-between gap-3">
              <button type="button" onMouseEnter={() => prefetchMedia(mediaItems[previousMediaIndex])} onFocus={() => prefetchMedia(mediaItems[previousMediaIndex])} onClick={showPrevious} className="pointer-events-auto inline-flex size-10 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-card backdrop-blur transition-transform duration-200 hover:scale-105" aria-label="Previous project media">
                <ChevronLeft className="size-4" />
              </button>
              <div className="flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-3 py-2 shadow-card backdrop-blur" aria-label={`${activeMediaIndex + 1} of ${mediaItems.length}`}>
                {mediaItems.map((item, itemIndex) => (
                  <span key={`${item.title}-${itemIndex}`} className={`size-1.5 rounded-full ${itemIndex === activeMediaIndex ? "bg-[hsl(var(--project-accent))]" : "bg-muted-foreground/30"}`} />
                ))}
              </div>
              <button type="button" onMouseEnter={() => prefetchMedia(mediaItems[nextMediaIndex])} onFocus={() => prefetchMedia(mediaItems[nextMediaIndex])} onClick={showNext} className="pointer-events-auto inline-flex size-10 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-card backdrop-blur transition-transform duration-200 hover:scale-105" aria-label="Next project media">
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
          {project.status && (
            <Badge variant="secondary" className="absolute left-5 top-5 border border-border bg-card/90 backdrop-blur">
              In progress
            </Badge>
          )}
        </div>
      </div>
    </article>
  );
}
