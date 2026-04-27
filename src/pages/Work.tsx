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
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"
        >
          <div>
            <span className="mb-4 inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground shadow-card">
              Selected work
            </span>
            <h1 className="font-display text-5xl font-semibold leading-[0.95] md:text-7xl">
              Product stories shaped like a working board.
            </h1>
          </div>
          <div className="rounded-[24px] border border-border bg-card p-6 shadow-card lg:rotate-1">
            <p className="text-lg leading-relaxed text-muted-foreground">
              A focused selection of real projects across education, AI workflows, communication tools and operational dashboards.
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
