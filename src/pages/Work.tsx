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
      <main className="mx-auto max-w-[1020px] px-6 pb-20 pt-24 md:pt-28">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-11"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-[7px] bg-primary px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-primary-foreground shadow-card">
            <span className="size-1.5 rounded-[1px] bg-primary-foreground/60" aria-hidden /> Work
          </div>
          <h1 className="font-display text-[42px] font-semibold leading-none text-foreground md:text-6xl">
            Selected Projects
          </h1>
          <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
              Compact case-study summaries with the key context, role, duration and outcome upfront — then you can open each project only if you want the full deep dive.
            </p>
            <Button asChild variant="outline" className="w-fit border-[1.5px] bg-card">
              <a href="/resume" data-cursor-action="navigate-internal">Resume <ArrowRight className="size-4" /></a>
            </Button>
          </div>
        </motion.section>

        <section className="space-y-4">
          {featuredProjects.map((project, index) => (
            <WorkProjectCard key={project.slug} project={project} index={index} />
          ))}
        </section>
      </main>
      <ContactFooter />
    </div>
  );
}
