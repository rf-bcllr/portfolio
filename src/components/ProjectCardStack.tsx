import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { WorkProjectCard } from "@/components/WorkProjectCard";
import type { FeaturedProject } from "@/data/featuredProjects";

interface ProjectCardStackProps {
  projects: FeaturedProject[];
}

const VISIBLE = 3;

// Positional styling for each slot in the stack (0 = front)
const slotStyles = [
  { scale: 1, y: 0, opacity: 1 },
  { scale: 0.94, y: -28, opacity: 0.75 },
  { scale: 0.88, y: -52, opacity: 0.5 },
];

export function ProjectCardStack({ projects }: ProjectCardStackProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const prefersReducedMotion = useReducedMotion();

  const total = projects.length;

  const visible = useMemo(() => {
    const count = Math.min(VISIBLE, total);
    return Array.from({ length: count }, (_, i) => {
      const projectIndex = (activeIndex + i) % total;
      return { project: projects[projectIndex], projectIndex, slot: i };
    });
  }, [activeIndex, projects, total]);

  const goNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((i) => (i + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((i) => (i - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  return (
    <div className="flex flex-col gap-8">
      <div className="relative min-h-[760px] lg:min-h-[680px]">
        <AnimatePresence initial={false} custom={direction}>
          {visible.map(({ project, projectIndex, slot }) => {
            const target = slotStyles[slot];
            const isFront = slot === 0;
            const zIndex = VISIBLE - slot;

            const initial = prefersReducedMotion
              ? { opacity: 0 }
              : direction === 1
                ? { scale: 0.84, y: -72, opacity: 0 }
                : { scale: 1.02, y: 360, opacity: 0 };

            const exit = prefersReducedMotion
              ? { opacity: 0 }
              : direction === 1
                ? { y: 420, scale: 1, opacity: 0 }
                : { y: -80, scale: 0.82, opacity: 0 };

            return (
              <motion.div
                key={project.slug}
                custom={direction}
                initial={initial}
                animate={{
                  scale: target.scale,
                  y: target.y,
                  opacity: target.opacity,
                }}
                exit={exit}
                transition={
                  prefersReducedMotion
                    ? { duration: 0.2 }
                    : { type: "spring", stiffness: 260, damping: 32, mass: 0.9 }
                }
                style={{ zIndex }}
                className={`absolute inset-x-0 top-0 origin-top ${
                  isFront ? "" : "pointer-events-none"
                }`}
                aria-hidden={!isFront}
                onClick={isFront ? undefined : goNext}
              >
                <WorkProjectCard project={project} index={projectIndex} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
          <span className="tabular-nums text-foreground">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span className="text-muted-foreground/60">/ {String(total).padStart(2, "0")}</span>
          <div className="ml-3 flex items-center gap-1.5">
            {projects.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                aria-label={`Go to project ${i + 1}`}
                onClick={() => {
                  setDirection(i >= activeIndex ? 1 : -1);
                  setActiveIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeIndex
                    ? "w-6 bg-foreground"
                    : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous project"
            className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-card transition-transform duration-200 hover:scale-105"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next project"
            className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-card transition-transform duration-200 hover:scale-105"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
