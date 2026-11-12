import "./stage.css";
import { ImageIcon, Sparkles } from "lucide-react";

/**
 * Stageshow-style pilot: faux product UI highlighting the AI image generation flow.
 * Only facts from projects data: teachers, FTD com Você, math word problems,
 * chemistry formulas, prompt engineering, token management, agent design.
 */
const Bar = ({ w, className = "" }: { w: string; className?: string }) => (
  <span className={`block h-2 rounded-full bg-foreground/15 ${className}`} style={{ width: w }} />
);

const Tile = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative overflow-hidden rounded-none border-2 border-foreground bg-card shadow-[4px_4px_0_0_hsl(var(--foreground))] ${className}`}>
    {children}
  </div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{children}</p>
);

export function AiImageGenerationBento() {
  return (
    <div className="stage-bento grid w-full max-w-[560px] grid-cols-2 gap-3 sm:grid-cols-3 sm:grid-rows-2" aria-label="AI image generation highlights" role="img">
      {/* Hero tile: question editor with image being generated */}
      <Tile className="col-span-2 p-4 sm:row-span-2">
        <div className="mb-3 flex items-center justify-between">
          <Label>FTD com Você · New question</Label>
          <span className="h-2 w-2 rounded-full bg-primary" />
        </div>
        <p className="font-display text-sm font-semibold leading-snug">Math word problem</p>
        <div className="mt-2 space-y-1.5">
          <Bar w="92%" />
          <Bar w="76%" />
        </div>
        <div className="relative mt-4 aspect-[16/9] w-full border-2 border-dashed border-foreground/30 bg-muted">
          <div className="stage-img absolute inset-0 flex items-center justify-center bg-primary/10">
            <ImageIcon className="h-10 w-10 text-primary" strokeWidth={1.5} />
          </div>
          <div className="stage-scan absolute inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-primary/25 to-transparent" />
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-full border-2 border-foreground bg-background px-3 py-1.5">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="stage-type truncate font-display text-[11px] font-medium">Generate image for this question</span>
        </div>
      </Tile>

      <Tile className="p-3">
        <Label>Prompt engineering</Label>
        <div className="mt-3 space-y-1.5">
          <Bar w="100%" />
          <Bar w="64%" className="bg-primary/40" />
          <Bar w="82%" />
        </div>
      </Tile>

      <Tile className="p-3">
        <Label>Token management</Label>
        <div className="mt-3 h-2.5 w-full border-2 border-foreground bg-background">
          <div className="stage-meter h-full bg-primary" />
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {["Math", "Chemistry"].map((s) => (
            <span key={s} className="border border-foreground px-1.5 py-0.5 font-display text-[9px] font-semibold uppercase">{s}</span>
          ))}
        </div>
      </Tile>
    </div>
  );
}
