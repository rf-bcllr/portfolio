import { SiteNav } from "@/components/SiteNav";
import { ProjectCardStack } from "@/components/ProjectCardStack";
import { ContactFooter } from "@/components/ContactFooter";
import { featuredProjects } from "@/data/featuredProjects";

export default function Work() {
  return (
    <div className="min-h-screen text-foreground">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
        <ProjectCardStack projects={featuredProjects} />
      </main>
      <ContactFooter />
    </div>
  );
}
