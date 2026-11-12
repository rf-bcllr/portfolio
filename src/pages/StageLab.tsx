import { projectsData } from "@/data/projects";
import { AiImageGenerationBento } from "@/components/stage/AiImageGenerationBento";

/** Hidden comparison page for the stageshow pilot (not linked anywhere). */
export default function StageLab() {
  const project = projectsData.find((p) => p.slug === "ai-image-generation");
  return (
    <main className="container mx-auto px-4 py-24">
      <h1 className="mb-10 font-display text-3xl font-semibold">Stageshow pilot<span className="text-primary">.</span></h1>
      <div className="grid gap-12 lg:grid-cols-2">
        <section>
          <p className="mb-4 font-display text-xs uppercase tracking-[0.14em] text-muted-foreground">Current GIF</p>
          {project && <img src={project.heroImage} alt="Current GIF" className="w-full max-w-[560px] border-2 border-foreground" />}
        </section>
        <section>
          <p className="mb-4 font-display text-xs uppercase tracking-[0.14em] text-muted-foreground">Bento highlights</p>
          <AiImageGenerationBento />
        </section>
      </div>
    </main>
  );
}
