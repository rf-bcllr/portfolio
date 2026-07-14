import { SiteNav } from "@/components/SiteNav";
import { ProjectCardStack } from "@/components/ProjectCardStack";
import { WorkProjectCard } from "@/components/WorkProjectCard";
import { ContactFooter } from "@/components/ContactFooter";
import { featuredProjects } from "@/data/featuredProjects";
import { useIsTabletOrBelow } from "@/hooks/use-tablet-or-below";

export default function Work() {
  const stackAsList = useIsTabletOrBelow();

  return (
    <div className="min-h-screen text-foreground">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
        {isMobile ? (
          <div className="flex flex-col gap-8">
            {featuredProjects.map((project, index) => (
              <WorkProjectCard key={project.slug} project={project} index={index} />
            ))}
          </div>
        ) : (
          <ProjectCardStack projects={featuredProjects} />
        )}
      </main>
      <ContactFooter />
    </div>
  );
}
