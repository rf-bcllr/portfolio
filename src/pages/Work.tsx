import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { WorkProjectCard } from "@/components/WorkProjectCard";
import { ContactFooter } from "@/components/ContactFooter";
import { Button } from "@/components/ui/button";
import { featuredProjects } from "@/data/featuredProjects";

export default function Work() {
  return (
    <div className="min-h-screen text-foreground">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"
        >
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--tag-blue-border))] bg-[hsl(var(--tag-blue-bg))] px-4 py-2 text-sm font-semibold text-[hsl(var(--tag-blue))] shadow-card">
              <Sparkles className="size-4" /> Selected work
            </span>
            <h1 className="font-display text-5xl font-semibold leading-[0.95] md:text-7xl">
              Project cards shaped like a working board.
            </h1>
          </div>
          <div className="rounded-[24px] border border-border bg-card p-6 shadow-card lg:rotate-1">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Editorial case-study summaries with the key context, role, timeline and signal upfront — with richer interface mockups directly inside each project card.
            </p>
            <Button asChild variant="contrast" className="mt-6">
              <a href="/resume" data-cursor-action="navigate-internal">
                Resume <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </motion.section>

        <section className="space-y-7">
          {featuredProjects.map((project, index) => (
            <WorkProjectCard key={project.slug} project={project} index={index} />
          ))}
        </section>
      </main>
      <ContactFooter />
    </div>
  );
}
