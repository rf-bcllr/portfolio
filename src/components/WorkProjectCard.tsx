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
  const isVertical = project.mediaLayout === "vertical";

  return (
    <Link
      to={`/project/${project.slug}`}
      data-cursor-action="navigate-internal"
      className={`group relative block overflow-hidden rounded-[24px] border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--project-accent-border))] hover:shadow-card-hover ${accentClassMap[project.accent]}`}
      style={{ transform: `rotate(${index % 2 === 0 ? "-0.35deg" : "0.35deg"})` }}
    >
      <article className={`grid ${compact ? "" : "lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.75fr)] xl:grid-cols-[minmax(0,0.9fr)_minmax(430px,0.8fr)]"}`}>
        <div className="relative flex flex-col justify-between gap-7 p-6 md:p-8">
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
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">{project.summary}</p>
          </div>

          <div className="grid gap-4 text-sm sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-bold uppercase text-muted-foreground">Duration</p>
              <p className="mt-1 font-semibold text-foreground">{project.duration}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase text-muted-foreground">Role</p>
              <p className="mt-1 font-semibold text-foreground">{project.role}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase text-muted-foreground">Outcome</p>
              <p className="mt-1 font-semibold text-[hsl(var(--project-accent))]">{project.outcome}</p>
            </div>
          </div>
        </div>

        <div className="relative flex min-h-[320px] items-center justify-center border-t border-border bg-secondary/60 p-8 md:min-h-[360px] lg:border-l lg:border-t-0">
          <span className="absolute left-3 top-3 size-2 rounded-[2px] border border-[hsl(var(--project-accent-border))] bg-card" aria-hidden />
          <span className="absolute right-3 top-3 size-2 rounded-[2px] border border-[hsl(var(--project-accent-border))] bg-card" aria-hidden />
          <span className="absolute bottom-3 left-3 size-2 rounded-[2px] border border-[hsl(var(--project-accent-border))] bg-card" aria-hidden />
          <span className="absolute bottom-3 right-3 size-2 rounded-[2px] border border-[hsl(var(--project-accent-border))] bg-card" aria-hidden />
          <div className="absolute right-5 top-6 hidden text-4xl md:block" aria-hidden>
            {project.emoji}
          </div>
          <div
            className={`relative flex w-full items-center justify-center rounded-[24px] border border-[hsl(var(--project-accent-border))] bg-card shadow-card ${
              isVertical
                ? "max-w-[230px] p-3 before:absolute before:left-1/2 before:top-2 before:h-1 before:w-12 before:-translate-x-1/2 before:rounded-full before:bg-muted"
                : "max-w-[420px] p-3 md:max-w-[500px]"
            }`}
          >
            <div
              className={`w-full overflow-hidden rounded-[18px] bg-secondary ${
                isVertical ? "aspect-[9/16]" : "aspect-[16/10]"
              }`}
            >
              <MediaThumb
                sources={project.media?.sources}
                poster={project.poster}
                src={project.media ? undefined : project.poster}
                alt={project.title}
                className="size-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                priority={index === 0}
                showSkeleton
              />
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
