import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { WorkProjectCard } from "@/components/WorkProjectCard";
import { featuredProjects, type FeaturedProject } from "@/data/featuredProjects";

/* Game case ids (public/game/js/data.js) → portfolio project slugs */
const CASE_TO_SLUG: Record<string, string> = {
  "case-transport": "students-transportation",
  "case-saude": "health-food-delivery",
  "case-meuarco": "meu-arco",
  "case-aiwriting": "ai-writing-assistant",
  "case-credit": "credit-transfer-analysis",
  "case-images": "ai-image-generation",
  "case-lesson": "lesson-plan-tool",
};

export default function Play() {
  const ref = useRef<HTMLIFrameElement>(null);
  const [project, setProject] = useState<FeaturedProject | null>(null);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Rafael Bacellar — Quest for the Next Product";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? null;
    meta?.setAttribute(
      "content",
      "Rafael Bacellar's portfolio as a playable RPG: 10+ years of product design, one street at a time."
    );
    return () => {
      document.title = prevTitle;
      if (meta && prevDesc !== null) meta.setAttribute("content", prevDesc);
    };
  }, []);

  const post = useCallback((msg: Record<string, unknown>) => {
    ref.current?.contentWindow?.postMessage(msg, window.location.origin);
  }, []);

  useEffect(() => {
    const onMessage = (ev: MessageEvent) => {
      if (ev.origin !== window.location.origin || ev.source !== ref.current?.contentWindow) return;
      if (ev.data?.type !== "rfb:open-case") return;
      const slug = CASE_TO_SLUG[ev.data.id];
      const found = featuredProjects.find((p) => p.slug === slug);
      if (found) setProject(found);
      else post({ type: "rfb:case-fallback", id: ev.data.id });
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [post]);

  const close = () => {
    setProject(null);
    post({ type: "rfb:case-closed" });
  };

  return (
    <>
      <iframe
        ref={ref}
        src="/game/index.html"
        title="Quest for the Next Product — a playable portfolio"
        allow="autoplay; fullscreen"
        onLoad={() => ref.current?.focus()}
        className="fixed inset-0 z-[40] h-dvh w-screen border-0 bg-background"
      />
      <Dialog open={!!project} onOpenChange={(o) => { if (!o) close(); }}>
        <DialogContent
          className="max-h-[92dvh] w-[96vw] max-w-5xl overflow-y-auto p-4 [&>button]:grid [&>button]:size-10 [&>button]:place-items-center [&>button]:rounded-full [&>button]:border-2 [&>button]:border-foreground [&>button]:bg-background [&>button]:text-foreground [&>button]:opacity-100 [&>button]:shadow-[2px_2px_0_0_hsl(var(--foreground))] [&>button]:transition-transform [&>button:hover]:translate-x-px [&>button:hover]:translate-y-px [&>button:hover]:shadow-[1px_1px_0_0_hsl(var(--foreground))] sm:p-6"
          onCloseAutoFocus={(e) => { e.preventDefault(); ref.current?.focus(); }}
        >
          <DialogTitle className="sr-only">{project?.title ?? "Project"}</DialogTitle>
          <DialogDescription className="sr-only">{project?.subtitle}</DialogDescription>
          {project && <WorkProjectCard project={project} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
