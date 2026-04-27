import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
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

export function WorkProjectCard({ project, index = 0, compact = false }: WorkProjectCardProps) {
  const isPhoneFrame = project.mediaPresentation.frame === "phone";
  const rotation = index % 2 === 0 ? "-0.25deg" : "0.25deg";

  return (
    <Link
      to={`/project/${project.slug}`}
      data-cursor-action="navigate-internal"
      className={`group relative block overflow-hidden rounded-[24px] border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--project-accent-border))] hover:shadow-card-hover ${accentClassMap[project.accent]}`}
      style={{ transform: `rotate(${rotation})` }}
    >
      <article className={`grid ${compact ? "" : "lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,0.88fr)] xl:grid-cols-[minmax(0,0.86fr)_minmax(520px,0.94fr)]"}`}>
        <div className="relative flex flex-col justify-between gap-8 p-6 md:p-8 lg:p-9">
          <span className="absolute inset-y-0 left-0 w-1.5 bg-[hsl(var(--project-accent))]" aria-hidden />
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
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
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">{project.summary}</p>
          </div>

          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-[18px] border border-border bg-secondary/60 p-4">
              <p className="text-[11px] font-bold uppercase text-muted-foreground">Duration</p>
              <p className="mt-1 font-semibold text-foreground">{project.duration}</p>
            </div>
            <div className="rounded-[18px] border border-border bg-secondary/60 p-4">
              <p className="text-[11px] font-bold uppercase text-muted-foreground">Role</p>
              <p className="mt-1 font-semibold text-foreground">{project.role}</p>
            </div>
            <div className="rounded-[18px] border border-[hsl(var(--project-accent-border))] bg-[hsl(var(--project-accent-bg))] p-4">
              <p className="text-[11px] font-bold uppercase text-muted-foreground">Outcome</p>
              <p className="mt-1 font-semibold text-[hsl(var(--project-accent))]">{project.outcome}</p>
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

        <div className={`figjam-grid relative flex items-center justify-center overflow-hidden border-t border-border bg-secondary/70 p-7 md:p-10 lg:border-l lg:border-t-0 ${isPhoneFrame ? "min-h-[560px]" : "min-h-[410px]"}`}>
          <div className="absolute right-5 top-6 hidden text-4xl opacity-80 md:block" aria-hidden>
            {project.emoji}
          </div>
          <div
            className={`relative w-full ${project.mediaPresentation.maxWidth} ${project.mediaPresentation.rotate ?? ""}`}
          >
            <div className={`relative overflow-hidden border border-[hsl(var(--project-accent-border))] bg-card shadow-card-hover ${isPhoneFrame ? "rounded-[34px] p-3 before:absolute before:left-1/2 before:top-3 before:z-10 before:h-1.5 before:w-16 before:-translate-x-1/2 before:rounded-full before:bg-foreground/25" : "rounded-[24px] p-2.5 pt-9 before:absolute before:left-5 before:top-4 before:size-2 before:rounded-full before:bg-muted-foreground/35 after:absolute after:left-9 after:top-4 after:size-2 after:rounded-full after:bg-muted-foreground/25"}`}>
              {!isPhoneFrame && <span className="absolute left-[52px] top-4 size-2 rounded-full bg-muted-foreground/20" aria-hidden />}
              <div className={`w-full overflow-hidden bg-secondary ${project.mediaPresentation.aspect} ${isPhoneFrame ? "rounded-[24px]" : "rounded-[16px]"}`}>
              <MediaThumb
                sources={project.media?.sources}
                poster={project.poster}
                src={project.media ? undefined : project.poster}
                alt={project.title}
                className="size-full object-contain transition-transform duration-500 group-hover:scale-[1.025]"
                priority={index === 0}
                showSkeleton
              />
              </div>
            </div>
          </div>
          {project.status && (
            <Badge variant="secondary" className="absolute left-5 top-5 border border-border bg-card/90 backdrop-blur">
              In progress
            </Badge>
          )}
        </div>
        <span className="absolute right-5 top-5 hidden rounded-full bg-foreground p-2 text-background transition-transform duration-300 group-hover:rotate-12 md:inline-flex">
          <ArrowUpRight className="size-4" />
        </span>
      </article>
    </Link>
  );
}
