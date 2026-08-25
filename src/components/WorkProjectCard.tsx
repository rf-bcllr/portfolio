import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bus, ChevronLeft, ChevronRight, GraduationCap, ImageIcon, NotebookPen, PenLine, Salad, Sparkles, Target, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MediaThumb } from "@/components/MediaThumb";
import type { FeaturedProject } from "@/data/featuredProjects";

const projectIconMap: Record<string, LucideIcon> = {
  "meu-arco": Target,
  "students-transportation": Bus,
  "health-food-delivery": Salad,
  "ai-writing-assistant": PenLine,
  "ai-image-generation": ImageIcon,
  "lesson-plan-tool": NotebookPen,
  "credit-transfer-analysis": GraduationCap,
  "ai-question-generator": Sparkles,
};

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
  purple: "project-card-purple",
  teal: "project-card-teal",
  claudeOrange: "project-card-claude-orange",
  guavaRed: "project-card-guava-red",
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

const parseHslString = (value: string): [number, number, number] | null => {
  const match = value.trim().match(/([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
  if (!match) return null;
  return [parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3])];
};

const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0, g = 0, b = 0;
  if (hp >= 0 && hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = ln - c / 2;
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
};

const relativeLuminance = (r: number, g: number, b: number) => {
  const toLin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
};

export function WorkProjectCard({ project, index = 0, compact = false }: WorkProjectCardProps) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const outcomeRef = useRef<HTMLDivElement | null>(null);
  const [outcomeTextColor, setOutcomeTextColor] = useState<string>("hsl(0 0% 8%)");
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

  useEffect(() => {
    if (!outcomeRef.current) return;
    const raw = getComputedStyle(outcomeRef.current).getPropertyValue("--project-accent-bg").trim();
    const hsl = parseHslString(raw);
    if (!hsl) return;
    const [r, g, b] = hslToRgb(hsl[0], hsl[1], hsl[2]);
    const lum = relativeLuminance(r, g, b);
    // WCAG contrast vs white and black; pick whichever gives higher contrast
    const contrastWhite = 1.05 / (lum + 0.05);
    const contrastBlack = (lum + 0.05) / 0.05;
    setOutcomeTextColor(contrastBlack >= contrastWhite ? "hsl(0 0% 8%)" : "hsl(0 0% 100%)");
  }, [project.accent]);

  const showPrevious = () => setActiveMediaIndex((current) => (current - 1 + mediaItems.length) % mediaItems.length);
  const showNext = () => setActiveMediaIndex((current) => (current + 1) % mediaItems.length);

  return (
    <article
      className={`group relative block overflow-hidden rounded-none border-2 border-foreground bg-card shadow-[8px_8px_0_0_hsl(var(--foreground))] transition-all duration-200 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[11px_11px_0_0_hsl(var(--foreground))] ${accentClassMap[project.accent]}`}
    >
      <div className={`grid ${compact ? "" : "lg:grid-cols-[minmax(0,0.9fr)_minmax(440px,0.92fr)] xl:grid-cols-[minmax(0,0.82fr)_minmax(560px,1fr)]"}`}>
        <div className="relative order-2 flex flex-col justify-between gap-7 p-6 md:p-8 lg:order-1 lg:p-9">
          <span className="absolute inset-y-0 left-0 w-2 bg-[hsl(var(--project-accent))]" aria-hidden />
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-1.5">
              {project.chips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center border border-foreground bg-transparent px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-foreground"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {chip}
                </span>
              ))}
            </div>
            <h3 className="font-display text-3xl font-bold leading-[0.9] tracking-[-0.035em] md:text-5xl">{project.title}</h3>
            <p
              className="mt-3 text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {project.category}
            </p>
            <p className="mt-5 max-w-3xl border-l-[6px] border-[hsl(var(--project-accent))] pl-5 text-base leading-relaxed text-foreground md:text-[17px]">{project.summary}</p>
          </div>

          <div
            ref={outcomeRef}
            className="relative overflow-hidden p-6 md:p-7"
            style={{
              backgroundColor: "hsl(var(--project-accent-bg))",
              color: outcomeTextColor,
            }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-[0.22em] opacity-70"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Outcome
            </p>
            <p className="mt-2 font-display text-5xl font-bold leading-[0.9] tracking-[-0.04em] md:text-6xl">
              {project.outcomeValue}
            </p>
            <p className="mt-3 max-w-sm text-sm font-medium leading-snug opacity-80 md:text-[15px]">
              {project.outcomeLabel}
            </p>
          </div>




          <div className="flex flex-wrap gap-1.5">
            {project.outcomeHighlights.map((item) => {
              const isModular = item === "MODULAR ARCHITECTURE FOR MULTIPLE UNIVERSITIES";
              return (
                <span
                  key={item}
                  className="inline-flex items-center border border-foreground bg-transparent px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-foreground"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {isModular ? (
                    <>
                      <span className="sm:hidden">Modular Architecture</span>
                      <span className="hidden sm:inline">{item}</span>
                    </>
                  ) : (
                    item
                  )}
                </span>
              );
            })}
          </div>
        </div>



        <div className={`relative order-1 flex items-center justify-center overflow-hidden border-b border-[hsl(var(--project-accent-border))] bg-[hsl(var(--project-accent-bg))] p-7 md:p-10 lg:order-2 lg:border-b-0 lg:border-l ${mediaAreaHeight}`}>
          {(() => {
            const Icon = projectIconMap[project.slug];
            return Icon ? (
              <div className="absolute right-5 top-6 hidden opacity-80 md:block text-foreground" aria-hidden>
                <Icon className="size-9" strokeWidth={1.75} />
              </div>
            ) : null;
          })()}
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
            <Badge variant="secondary" className="absolute left-5 top-5 border-2 border-foreground bg-foreground text-background hover:bg-foreground">
              In progress
            </Badge>
          )}
        </div>
      </div>
    </article>
  );
}
