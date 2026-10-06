import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { WorkProjectCard } from "@/components/WorkProjectCard";
import { featuredProjects, type FeaturedProject } from "@/data/featuredProjects";
import questLogo from "@/assets/quest-logo.png.asset.json";

/* Game case ids (public/game/js/data.js) → portfolio project slugs */
const CASE_TO_SLUG: Record<string, string> = {
  "case-transport": "students-transportation",
  "case-saude": "health-food-delivery",
  "case-meuarco": "meu-arco",
  "case-aiwriting": "ai-writing-assistant",
  "case-credit": "credit-transfer-analysis",
  "case-images": "ai-image-generation",
  "case-lesson": "lesson-plan-tool",
  "case-ionic-identity": "ionic-ai-identity",
};

const LOAD_TIPS = [
  "Tip: E talks to people and opens chests.",
  "Tip: C opens your Character Sheet.",
  "Tip: 1, 2, 3 answer questions and pick battle commands.",
];

/* Same look as the game's own loading screen, shown while the iframe boots. */
function GameLoading({ visible, progress }: { visible: boolean; progress: number }) {
  const [tip, setTip] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setTip((i) => (i + 1) % LOAD_TIPS.length), 2400);
    return () => window.clearInterval(t);
  }, []);
  return (
    <div
      role="status"
      aria-live="polite"
      aria-hidden={!visible}
      className={`fixed inset-0 z-[45] grid place-items-center overflow-y-auto bg-background p-4 transition-opacity duration-250 motion-reduce:transition-none ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <div className="flex w-full max-w-[420px] flex-col gap-4 rounded-none border-[3px] border-foreground bg-card px-5 py-4 shadow-[8px_8px_0_0_hsl(var(--foreground))]">
        <div className="text-center"><img src={questLogo.url} alt="End-to-End Quest for the Next Product" width={1774} height={887} className="mx-auto mb-3 h-auto max-h-[22dvh] w-full object-contain" /><p className="font-display text-xs font-bold text-primary">LOADING ADVENTURE</p></div>
        <div className="flex justify-between gap-3 font-display text-[11px] font-bold tabular-nums text-muted-foreground"><span>PREPARING THE MAP</span><span>{progress}%</span></div>
        <div className="game-ld-runway" style={{ "--load-progress": progress / 100 } as React.CSSProperties}>
          <div className="game-ld-hero" aria-hidden="true" />
          <div className="game-ld-bar" role="progressbar" aria-label="Loading game assets" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><div className="game-ld-fill" /></div>
        </div>
        <p className="min-h-[3.2em] border-l-4 border-primary bg-background px-3 py-2.5 text-left text-xs leading-5 text-muted-foreground">{LOAD_TIPS[tip]}</p>
      </div>
    </div>
  );
}

/* The project card is the dialog itself: natural size, scaled down uniformly
   when the viewport is smaller. */
function FitCard({ children }: { children: React.ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(() => Math.min(1104, window.innerWidth - 32));
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const fit = () => {
      const w = Math.min(1104, window.innerWidth - 32);
      setWidth(w);
      const h = el.offsetHeight;
      setScale(Math.min(1, (window.innerHeight - 32) / Math.max(1, h)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener("resize", fit);
    return () => { ro.disconnect(); window.removeEventListener("resize", fit); };
  }, []);
  return (
    <div ref={inner} className="relative" style={{ width, transform: scale < 1 ? `scale(${scale})` : undefined, transformOrigin: "center" }}>
      {children}
      <DialogClose
        aria-label="Close"
        className="absolute -right-3.5 -top-3.5 z-10 grid size-10 aspect-square place-items-center rounded-full border-2 border-foreground bg-background p-0 text-foreground shadow-[2px_2px_0_0_hsl(var(--foreground))] transition-[transform,box-shadow] duration-150 ease-out hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0_0_hsl(var(--foreground))] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none"
      >
        <X className="size-5" aria-hidden="true" />
      </DialogClose>
    </div>
  );
}

export default function Play() {
  const navigate = useNavigate();
  const ref = useRef<HTMLIFrameElement>(null);
  const [project, setProject] = useState<FeaturedProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 10000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Quest for the Next Product";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? null;
    meta?.setAttribute(
      "content",
      "A playable pixel-art portfolio: explore a product design career, discover projects, and face its challenges."
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
      if (ev.data?.type === "rfb:recruiter-mode") {
        navigate("/resume");
        return;
      }
      if (ev.data?.type === "rfb:loading" && typeof ev.data.percent === "number") {
        setLoadProgress((current) => Math.max(current, Math.min(100, ev.data.percent)));
        return;
      }
      if (ev.data?.type === "rfb:loaded") { setLoading(false); return; }
      if (ev.data?.type !== "rfb:open-case") return;
      const slug = CASE_TO_SLUG[ev.data.id];
      const found = featuredProjects.find((p) => p.slug === slug);
      if (found) setProject(found);
      else post({ type: "rfb:case-fallback", id: ev.data.id });
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [post, navigate]);

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
      <GameLoading visible={loading} progress={loadProgress} />
      <Dialog open={!!project} onOpenChange={(o) => { if (!o) close(); }}>
        <DialogContent
          className="w-auto max-w-none place-items-center gap-0 overflow-visible border-0 bg-transparent p-0 shadow-none sm:rounded-none [&>button:last-child]:hidden"
          onCloseAutoFocus={(e) => { e.preventDefault(); ref.current?.focus(); }}
        >
          <DialogTitle className="sr-only">{project?.title ?? "Project"}</DialogTitle>
          <DialogDescription className="sr-only">{project?.subtitle}</DialogDescription>
          {project && <FitCard><WorkProjectCard project={project} /></FitCard>}
        </DialogContent>
      </Dialog>
    </>
  );
}
