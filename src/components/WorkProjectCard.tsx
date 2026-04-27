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

export function WorkProjectCard({ project, index = 0, compact = false }: WorkProjectCardProps) {
  return (
    <Link
      to={`/project/${project.slug}`}
      data-cursor-action="navigate-internal"
      className="group block rounded-[24px] border border-border bg-card p-3 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover"
      style={{ transform: `rotate(${index % 2 === 0 ? "-0.35deg" : "0.35deg"})` }}
    >
      <article className={`grid gap-5 ${compact ? "" : "lg:grid-cols-[1.15fr_0.85fr] lg:items-center"}`}>
        <div className="relative overflow-hidden rounded-[18px] border border-border bg-secondary">
          <MediaThumb
            sources={project.media?.sources}
            poster={project.poster}
            src={project.media ? undefined : project.poster}
            alt={project.title}
            className="aspect-[16/10] size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            priority={index === 0}
            showSkeleton
          />
          {project.status && (
            <Badge variant="secondary" className="absolute left-3 top-3 border border-border bg-card/90 backdrop-blur">
              In progress
            </Badge>
          )}
        </div>

        <div className="flex h-full flex-col justify-between gap-6 p-2 lg:p-4">
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                {project.year} · {project.company}
              </span>
              <span className="rounded-full bg-foreground p-2 text-background transition-transform duration-300 group-hover:rotate-12">
                <ArrowUpRight className="size-4" />
              </span>
            </div>
            <h3 className="font-display text-3xl font-semibold leading-tight md:text-4xl">{project.title}</h3>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">{project.subtitle}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.chips.map((chip) => (
              <Badge key={chip} variant="outline" className="rounded-full bg-card">
                {chip}
              </Badge>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
