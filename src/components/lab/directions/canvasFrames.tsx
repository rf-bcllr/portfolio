/**
 * Content of the canvas direction: one Figma-style section per case, each holding a few
 * stageshow pieces (src/components/stage/pieces) rebuilt faithfully from the real screens,
 * with notes in Rafa's own documentation style (numbered markers + note cards).
 */
import { useEffect, useLayoutEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { ArcoAlerts, ArcoInvoice, ArcoRequests, CqGate, CqStaff, CqStudent, IonDuo, IonMood, IonProcess, QuestBoss, QuestRoute } from "@/components/stage/pieces/ProductPieces";
import { AiImgOptions, AiImgPrompt, AiImgSuggestion } from "@/components/stage/pieces/AiImagePieces";
import { CalConnect, CalLegend, CalWeek } from "@/components/stage/pieces/CalendarPieces";
import { WrFeedback, WrImprove, WrRecipients } from "@/components/stage/pieces/WritingPieces";
import { LpCreate, LpProfiles } from "@/components/stage/pieces/LessonPieces";
import { SpHome, SpPoints, SpProduct } from "@/components/stage/pieces/SaudePieces";
import { outcomeOf, projects } from "./shared";

export type Note = { t: string; d: string; a?: string };
export type Piece = { id: string; name: string; C: ComponentType; notes: Note[] };
export type Sec = {
  id: string; title: string; facts: string; result: { value: string; label: string; measured: boolean };
  href?: string; cta?: string; pieces: Piece[];
};

const a = (name: string) => `[data-anchor="${name}"]`;
const fromProject = (slug: string) => {
  const p = projects.find((x) => x.slug === slug)!;
  return { facts: `${p.company} · ${p.year} · ${p.category}`, result: outcomeOf(p), href: p.playInsteadOfOutcome ? "/play" : `/project/${p.slug}`, cta: p.playInsteadOfOutcome ? "Play the game" : "Open the case study" };
};

export const SECTIONS: Sec[] = [
  {
    id: "meu-arco", title: "Meu Arco", ...fromProject("meu-arco"),
    pieces: [
      { id: "arco-alerts", name: "Home · Alerts rail", C: ArcoAlerts, notes: [{ t: "One rail for every alert", d: "Re-enrolment, materials, contracts and polls share one sideways rail. The last card, Ver mais, is an exit rather than more content.", a: a("rail") }] },
      { id: "arco-invoice", name: "Home · Invoice", C: ArcoInvoice, notes: [{ t: "One action per card", d: "The invoice only asks to pay; the details wait behind Ver fatura.", a: a("pay") }] },
      { id: "arco-requests", name: "Home · Requests + tab bar", C: ArcoRequests, notes: [{ t: "Requests stay one row tall", d: "Ongoing requests scroll sideways, so the next decision stays in view.", a: a("reqs") }, { t: "Three apps, one bar", d: "Home, messages, calendar and finance used to live in separate products.", a: a("tabs") }] },
    ],
  },
  {
    id: "students-transportation", title: "Cheguei", ...fromProject("students-transportation"),
    pieces: [
      { id: "cq-student", name: "Parent · Student card", C: CqStudent, notes: [{ t: "Built for split attention", d: "A parent at the wheel gets one big button. Transport is set once, above it.", a: a("cta") }] },
      { id: "cq-gate", name: "Parent · Gate sheet", C: CqGate, notes: [{ t: "Where, before who", d: "Schools with several gates ask where the parent is, so staff walk the child to the right one.", a: a("gate") }] },
      { id: "cq-staff", name: "School · Arrivals", C: CqStaff, notes: [{ t: "Waiting time in sight", d: "Each arrival carries a running timer, so staff see who has waited longest.", a: a("timer") }, { t: "Accept, then complete", d: "One tap accepts; the same button becomes Concluir.", a: a("accept") }] },
    ],
  },
  {
    id: "ai-image-generation", title: "Images for questions, with AI", ...fromProject("ai-image-generation"),
    pieces: [
      { id: "ai-hint", name: "Activity · Visual-support hint", C: AiImgSuggestion, notes: [{ t: "Suggested, never forced", d: "The AI flags questions that would gain from a visual; the teacher decides whether to generate.", a: a("hint") }] },
      { id: "ai-prompt", name: "Modal · Describe the image", C: AiImgPrompt, notes: [{ t: "Context comes along", d: "Subject, grade and the inclusive tag travel with the question, so the idea can be one line.", a: a("rec") }, { t: "Limits at the field", d: "A 300-character count and the accuracy warning sit with the input.", a: a("field") }] },
      { id: "ai-options", name: "Modal · Four options", C: AiImgOptions, notes: [{ t: "Four takes, one choice", d: "For diagrams, variety beats a single guess.", a: a("grid") }, { t: "Feedback on the spot", d: "Thumbs on the result feed quality tracking; Gerar novamente stays secondary.", a: a("fb") }] },
    ],
  },
  {
    id: "calendar", title: "Calendar, connected to Google Agenda",
    facts: "FTD Educação · 2026 · Web App · EdTech · Integration",
    result: { value: "In progress", label: "", measured: false },
    pieces: [
      { id: "cal-legend", name: "Calendar · Legend + sync status", C: CalLegend, notes: [{ t: "Sync status always in view", d: "A tag beside the legend says whether Google Agenda is connected, and opens Settings.", a: a("status") }] },
      { id: "cal-week", name: "Calendar · Month, two weeks", C: CalWeek, notes: [{ t: "A teacher's year on one grid", d: "Holidays by state, themed dates, reminders and generated materials share the days; overflow becomes Ver +1.", a: ".cl-more" }] },
      { id: "cal-connect", name: "Settings · Connect", C: CalConnect, notes: [{ t: "Say what syncs before asking", d: "The dialog explains the sync is one-way and holidays aren't sent, before Google's consent screen.", a: a("dialog") }, { t: "Confirmed twice", d: "The switch turns on with the account named, and a toast confirms it.", a: a("toast") }] },
    ],
  },
  {
    id: "ai-writing-assistant", title: "AI Writing Assistant", ...fromProject("ai-writing-assistant"),
    pieces: [
      { id: "wr-rec", name: "Message · Recipients", C: WrRecipients, notes: [{ t: "Audience first", d: "Classes become chips with a live count of who will receive it.", a: a("chip") }] },
      { id: "wr-improve", name: "Message · Improve with AI", C: WrImprove, notes: [{ t: "AI where the text is", d: "Select a passage and Melhorar texto com IA appears beside it; the rewrite lands in the same field.", a: a("menu") }, { t: "Waiting, shaped like text", d: "The draft turns into a skeleton while the AI works, then fades back rewritten.", a: a("body") }] },
      { id: "wr-feedback", name: "Message · Feedback toast", C: WrFeedback, notes: [{ t: "Rate the rewrite", d: "Amei, Quero ajustar or Tente novamente: feedback that also offers the next step.", a: a("toast") }] },
    ],
  },
  {
    id: "lesson-plan-tool", title: "Lesson plans + learning profiles", ...fromProject("lesson-plan-tool"),
    pieces: [
      { id: "lp-profiles", name: "Profiles · List", C: LpProfiles, notes: [{ t: "Profiles, not diagnoses", d: "A profile names a group with shared needs; generated plans and activities adapt to it.", a: a("row") }] },
      { id: "lp-create", name: "Profiles · Create", C: LpCreate, notes: [{ t: "Observable needs", d: "Teachers tick needs from a checklist instead of typing a diagnosis.", a: a("traits") }] },
    ],
  },
  {
    id: "health-food-delivery", title: "Saúde e Ponto", ...fromProject("health-food-delivery"),
    pieces: [
      { id: "sp-product", name: "Product · Detail", C: SpProduct, notes: [{ t: "Health facts beside the price", d: "Whole grain, zero cholesterol and the point it earns show before checkout.", a: a("tags") }] },
      { id: "sp-points", name: "Checkout · Points earned", C: SpPoints, notes: [{ t: "Rewarded for healthy picks", d: "Points land at checkout, with a bonus for collecting in store.", a: a("win") }] },
      { id: "sp-home", name: "Home · Nearby", C: SpHome, notes: [{ t: "Balance on every screen", d: "The points pill stays in the header, next to the greeting.", a: a("balance") }] },
    ],
  },
  {
    id: "ionic-ai-identity", title: "Lia & Íon", ...fromProject("ionic-ai-identity"),
    pieces: [
      { id: "ion-duo", name: "Characters", C: IonDuo, notes: [{ t: "Two characters, two roles", d: "Lia hunts for books and knowledge; Íon is her alien companion aboard the Iônica library spaceship." }] },
      { id: "ion-mood", name: "Moodboard · Lia", C: IonMood, notes: [{ t: "Personality first", d: "Each character started from its own moodboard." }] },
      { id: "ion-process", name: "Process", C: IonProcess, notes: [{ t: "20+ alternatives", d: "Explored before the final pair, and named with the content designers." }] },
    ],
  },
  {
    id: "quest-for-the-next-product", title: "Quest for the Next Product", ...fromProject("quest-for-the-next-product"),
    pieces: [
      { id: "q-route", name: "Levels · 2015 → 2016", C: QuestRoute, notes: [{ t: "Each job a chapter", d: "The career becomes a 2D side-scroller; real places become levels." }] },
      { id: "q-boss", name: "Boss · The Imposter", C: QuestBoss, notes: [{ t: "The final boss", d: "A battle against The Imposter." }] },
    ],
  },
];

/** Renders a piece at its natural width and scales it down only when the column is narrower. */
export function Fit({ children }: { children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ s: 1, h: 0, w: 0 });
  useLayoutEffect(() => {
    const o = outer.current, i = inner.current;
    if (!o || !i) return;
    const ro = new ResizeObserver(() => {
      const avail = o.parentElement?.clientWidth ?? o.clientWidth;
      const w = i.offsetWidth;
      const s = Math.min(1, avail / w);
      setBox({ s, h: i.offsetHeight * s, w: w * s });
    });
    ro.observe(i);
    if (o.parentElement) ro.observe(o.parentElement);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={outer} style={{ width: box.w || undefined, height: box.h || undefined, overflow: "clip", overflowClipMargin: 16 }}>
      <div ref={inner} className="relative w-max" style={{ transform: `scale(${box.s})`, transformOrigin: "top left" }}>
        {children}
      </div>
    </div>
  );
}

/**
 * Numbered markers that follow the element each note describes while the piece animates;
 * a marker hides while its element is faded out or scrolled out of its container.
 */
export function Markers({ anchors, start = 1 }: { anchors: (string | undefined)[]; start?: number }) {
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
          if (!sel) return null;
          const node = root.querySelector<HTMLElement>(sel);
          if (!node) return null;
          const r = node.getBoundingClientRect();
          if (!r.width) return null;
          return visible(node, r.left + r.width / 2, r.top + r.height / 2) ? { x: (r.right - rr.left) / s, y: (r.top + Math.min(r.height / 2, 16 * s) - rr.top) / s } : null;
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
      {pos.map((p, n) => (p ? <span key={n} className="fg-marker" style={{ left: p.x, top: p.y }}>{start + n}</span> : null))}
    </div>
  );
}
