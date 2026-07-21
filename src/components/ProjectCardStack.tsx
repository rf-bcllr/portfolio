import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  { scale: 0.94, y: -28, opacity: 1 },
  { scale: 0.88, y: -52, opacity: 1 },
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

  const frontRef = useRef<HTMLDivElement | null>(null);
  const [frontHeight, setFrontHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = frontRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const update = () => setFrontHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [activeIndex]);

  return (
    <div
      className="relative flex flex-col gap-6"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured projects"
    >
      <div
        className="relative"
        style={{ minHeight: frontHeight ? frontHeight + 8 : undefined }}
      >
        {/* Side chevrons — fixed to the viewport so their position never shifts when cards with different heights rotate. */}
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous project"
          className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 items-center justify-center border-2 border-foreground bg-background text-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-colors hover:bg-primary hover:text-primary-foreground lg:inline-flex lg:size-12 xl:left-8"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next project"
          className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 items-center justify-center border-2 border-foreground bg-background text-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-colors hover:bg-primary hover:text-primary-foreground lg:inline-flex lg:size-12 xl:right-8"
        >
          <ChevronRight className="size-5" />
        </button>

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
                ref={isFront ? frontRef : undefined}
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
                style={{
                  zIndex,
                  ...(isFront || !frontHeight
                    ? {}
                    : { height: frontHeight, overflow: "hidden" }),
                }}
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

      {/* Keyboard instruction */}
      <p
        className="pt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground text-center"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Use the arrows or your keyboard&apos;s ← → keys to browse projects
      </p>
    </div>
  );
}
