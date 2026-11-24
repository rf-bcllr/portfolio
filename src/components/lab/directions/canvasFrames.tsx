/**
 * Shared by the canvas direction: each case's live stageshow rebuild (src/components/stage), a
 * Portuguese line in the product's own language, and notes pinned to the element they describe.
 */
import { useEffect, useLayoutEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { MeuArcoBento } from "@/components/stage/MeuArcoBento";
import { ChegueiBento } from "@/components/stage/ChegueiBento";
import { AiImageGenerationBento } from "@/components/stage/AiImageGenerationBento";
import { IonicBento } from "@/components/stage/IonicBento";
import { QuestBento } from "@/components/stage/QuestBento";
import { SaudeBento } from "@/components/stage/SaudeBento";
import { WritingBento } from "@/components/stage/WritingBento";
import { LessonPlanBento } from "@/components/stage/LessonPlanBento";
import { CreditTransferBento } from "@/components/stage/CreditTransferBento";

export type Frame = { Fragment: ComponentType; pt: string; notes: [text: string, anchor: string][] };

/** Per case: the live fragment, a Portuguese line, and notes pinned to the element they describe (a selector inside the fragment). */
export const FRAMES: Record<string, Frame> = {
  "meu-arco": {
    Fragment: MeuArcoBento,
    pt: "Três plataformas, um app",
    notes: [
      ["Alerts ride one rail; the fifth card is an exit, not more content.", ".ar-rail"],
      ["One primary action per card: the invoice only asks to pay.", ".ar-pay"],
      ["Requests scroll sideways, so the home stays one screen of decisions.", ".ar-reqs"],
    ],
  },
  "students-transportation": {
    Fragment: ChegueiBento,
    pt: "O responsável avisa, a escola libera",
    notes: [
      ["Built for a driver's split attention: one big Cheguei button.", ".cq-hero .cq-button"],
      ["The parent changes transport and picks the gate before arriving.", ".cq-transport-tile"],
      ["Staff accept the pickup in one tap; the parent sees it change.", ".cq-staff .cq-button"],
    ],
  },
  "health-food-delivery": {
    Fragment: SaudeBento,
    pt: "Nutrição antes do carrinho",
    notes: [
      ["Nutrition tags sit above the fold, read before checkout.", ".sp-tags"],
      ["Quantity and add share one row to keep the order fast.", ".sp-add"],
      ["Healthy picks earn points, rewarded right after the tap.", ".sp-toast"],
    ],
  },
  "ai-writing-assistant": {
    Fragment: WritingBento,
    pt: "Revisar antes de enviar",
    notes: [
      ["Moderation first: the assistant flags what families would see.", ".wr-word"],
      ["Every suggestion is accepted by the sender, never applied silently.", ".wr-sug"],
      ["Tone control for school voice: formal or friendly.", ".wr-tone"],
    ],
  },
  "ai-image-generation": {
    Fragment: AiImageGenerationBento,
    pt: "A figura certa para a questão",
    notes: [
      ["Starts from the selected question, not a blank prompt.", ".aig-selected-question"],
      ["Four options to choose from, inserted straight into the question.", ".aig-options"],
      ["Scoped to subject and grade, where visual questions matter most.", ".aig-subject"],
    ],
  },
  "lesson-plan-tool": {
    Fragment: LessonPlanBento,
    pt: "Um plano para cada turma",
    notes: [
      ["Learning profiles group shared needs (TDAH, dislexia, TEA).", ".lp-profile"],
      ["Adapted steps are marked, so the teacher sees what changed.", ".lp-sec.is-adapt"],
      ["The AI disclaimer stays on every screen.", ".lp-foot"],
    ],
  },
  "credit-transfer-analysis": {
    Fragment: CreditTransferBento,
    pt: "Seu histórico, seus créditos",
    notes: [
      ["Five steps, always visible: no dead ends.", ".ct-side ol"],
      ["The student checks what was read from the transcript.", ".ct-sum"],
      ["Email asked at the finish line, once the value is shown.", ".ct-field"],
    ],
  },
  "ionic-ai-identity": {
    Fragment: IonicBento,
    pt: "Lia e Íon a bordo",
    notes: [
      ["Two characters with two jobs: Lia discovers, Íon explains.", ".ionic-hero"],
      ["Each built from its own moodboard.", ".ionic-reference"],
      ["20+ alternatives explored; named with the content designers.", ".ionic-process"],
    ],
  },
  "quest-for-the-next-product": {
    Fragment: QuestBento,
    pt: "Cada emprego, um capítulo",
    notes: [
      ["Each job is a level; the route runs from university to now.", ".quest-hero"],
      ["Places from the career become scenes.", ".quest-coast"],
      ["The boss is the impostor syndrome.", ".quest-boss"],
    ],
  },
};

/** Renders a fragment at its 560px design width and scales it down when the column is narrower. */
export function Fit({ children }: { children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ s: 1, h: 0 });
  useLayoutEffect(() => {
    const o = outer.current, i = inner.current;
    if (!o || !i) return;
    const ro = new ResizeObserver(() => {
      const s = Math.min(1, o.clientWidth / 560);
      setBox({ s, h: i.offsetHeight * s });
    });
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={outer} style={{ height: box.h || undefined, overflow: "clip", overflowClipMargin: 16 }}>
      <div ref={inner} className="relative mx-auto" style={{ width: 560, transform: `scale(${box.s})`, transformOrigin: "top left", marginLeft: box.s < 1 ? 0 : undefined }}>
        {children}
      </div>
    </div>
  );
}

/**
 * Numbered pins that follow the element each note describes, frame by frame while the stamp is on
 * screen; a pin hides while its element is faded out or scrolled out of its tile.
 */
export function Pins({ anchors }: { anchors: string[] }) {
  const layer = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<({ x: number; y: number } | null)[]>([]);
  useEffect(() => {
    const el = layer.current;
    const root = el?.parentElement;
    if (!el || !root) return;
    let raf = 0;
    let on = false;
    const visible = (node: HTMLElement, cx: number, cy: number) => {
      for (let n: HTMLElement | null = node; n && n !== root; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (Number(cs.opacity) < 0.3 || cs.visibility === "hidden") return false;
        if (n !== node && cs.overflow !== "visible") {
          const r = n.getBoundingClientRect();
          if (cx < r.left || cx > r.right || cy < r.top || cy > r.bottom) return false;
        }
      }
      return true;
    };
    const tick = () => {
      const rr = root.getBoundingClientRect();
      const s = rr.width / root.offsetWidth || 1;
      setPos(
        anchors.map((sel) => {
          const node = root.querySelector<HTMLElement>(sel);
          if (!node) return null;
          const r = node.getBoundingClientRect();
          if (!r.width) return null;
          // Visible if the element's own centre shows; the pin sits on its right edge, half outside.
          const px = r.right, py = r.top + Math.min(r.height / 2, 16 * s);
          return visible(node, r.left + r.width / 2, r.top + r.height / 2) ? { x: (px - rr.left) / s, y: (py - rr.top) / s } : null;
        }),
      );
      if (on) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (on) raf = requestAnimationFrame(tick);
    });
    io.observe(root);
    return () => { on = false; cancelAnimationFrame(raf); io.disconnect(); };
  }, [anchors]);
  return (
    <div ref={layer} className="pointer-events-none absolute inset-0" aria-hidden="true">
      {pos.map((p, n) =>
        p ? <span key={n} className="cv-pin" style={{ left: p.x, top: p.y }}>{n + 1}</span> : null,
      )}
    </div>
  );
}

