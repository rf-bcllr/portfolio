import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { WorkProjectCard } from "@/components/WorkProjectCard";
import { ContactFooter } from "@/components/ContactFooter";
import { Button } from "@/components/ui/button";
import { featuredProjects } from "@/data/featuredProjects";

export default function Work() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-14 md:pt-20">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-16 grid gap-10 border-b border-border pb-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end md:mb-20 md:pb-16"
        >
          <div>
            <span className="mb-6 inline-flex rounded-full border border-border bg-card/70 px-4 py-2 text-sm font-semibold text-muted-foreground shadow-card backdrop-blur">
              Selected work
            </span>
            <h1 className="max-w-4xl font-display text-6xl font-semibold leading-[0.88] md:text-8xl">
              Project cards shaped like a working board.
            </h1>
          </div>
          <div className="max-w-xl lg:justify-self-end">
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
              Compact case-study summaries with the key context, role, duration and outcome upfront — then you can open each project only if you want the full deep dive.
            </p>
            <Button asChild variant="contrast" className="mt-6">
              <a href="/resume" data-cursor-action="navigate-internal">
                Resume <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </motion.section>

        <section className="space-y-8 md:space-y-10">
          {featuredProjects.map((project, index) => (
            <WorkProjectCard key={project.slug} project={project} index={index} />
          ))}
        </section>
      </main>
      <ContactFooter />
    </div>
  );
}
