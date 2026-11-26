/**
 * Content of the canvas direction. One Figma-style section per case: the case notes that used to
 * live on the project pages (challenge, what I did, results), and a stageshow stage built to show
 * the design thinking behind the product, annotated in Rafa's documentation style.
 */
import { useEffect, useRef, useState, type ComponentType } from "react";
import { IonArt, IonMoods, IonSheets, QuestPlay } from "@/components/stage/pieces/ProductPieces";
import { CalendarDay } from "@/components/stage/pieces/CalendarDay";
import { ChegueiHistory } from "@/components/stage/pieces/ChegueiHistory";
import { ArcoPay } from "@/components/stage/pieces/ArcoMore";
import { LessonFlow } from "@/components/stage/pieces/LessonFlow";
import { AiImgOptions, AiImgPrompt } from "@/components/stage/pieces/AiImagePieces";
import { ArcoSystem } from "@/components/stage/pieces/ArcoSystem";
import { CalendarSystem } from "@/components/stage/pieces/CalendarSystem";
import { ChegueiSystem } from "@/components/stage/pieces/ChegueiSystem";
import { LessonSystem } from "@/components/stage/pieces/LessonSystem";
import { SaudeRoute, SaudeStories } from "@/components/stage/pieces/SaudeFlows";
import { SaudeSystem } from "@/components/stage/pieces/SaudeSystem";
import { WritingSystem } from "@/components/stage/pieces/WritingSystem";
import { outcomeOf, projects } from "./shared";

export type Note = { t: string; d: string; a?: string };
export type Piece = { id: string; name: string; C: ComponentType; notes: Note[]; w?: number; h?: number };
export type Case = { challenge: string; did: string[]; results: string[]; meta: [string, string][] };
export type Sec = {
  id: string; title: string; facts: string; result: { value: string; label: string; measured: boolean };
  case?: Case; pieces: Piece[];
};

const fromProject = (slug: string) => {
  const p = projects.find((x) => x.slug === slug)!;
  return { facts: `${p.company} · ${p.year} · ${p.category}`, result: outcomeOf(p) };
};

export const SECTIONS: Sec[] = [
  {
    id: "meu-arco", title: "Meu Arco", ...fromProject("meu-arco"),
    case: {
      challenge: "Arco had bought several school brands, each with its own platform. A teacher opened three tabs every morning, and 45% of support tickets were some version of “I can’t find where to…”. The brief: one experience, without erasing each school’s identity.",
      did: ["Contextual research in 25+ schools, 150+ hours of observation", "8 design-thinking workshops to align competing brand teams", "A unified design system: 40+ components, 200+ variants, semantic theming", "120+ screens and 50+ prototypes, built daily with 5 engineers"],
      results: ["App rating 2.9 → 4.8★", "SUS score 90", "35% fewer support tickets", "100% rollout ahead of schedule"],
      meta: [["Role", "Product designer, research to handoff"], ["Team", "PM, 5 engineers"], ["Time", "16 weeks"]],
    },
    pieces: [
      { id: "arco-theme", w: 700, h: 680, name: "System · A home that assembles itself", C: ArcoSystem, notes: [
        { t: "A home made of modules", d: "Each school turns its own modules on. Switch child, and the home keeps only what that school offers.", a: ".ars-mods" },
        { t: "School colour as light", d: "The school’s colour lights the background. Buttons and alerts stay Gravity’s, so every action looks the same at every school.", a: ".ars-school" },
        { t: "Navigation follows", d: "A tab exists only if its module does: no payments at this school, no payments tab.", a: ".ars-tabs" },
      ] },
      { id: "arco-pay", w: 700, h: 680, name: "From isaac · One invoice for the family", C: ArcoPay, notes: [
        { t: "Every child, one bill", d: "Tuition, the English course and a second child at another school add up to one invoice with one Pagar.", a: ".arm-total" },
        { t: "Two apps became one", d: "Messaging came from ClassApp and finance from isaac; Meu Arco puts both in one account and one tab bar.", a: ".arm-card" },
      ] },
    ],
  },
  {
    id: "students-transportation", title: "Cheguei", ...fromProject("students-transportation"),
    case: {
      challenge: "At pickup time, parents waited at the gate not knowing if the school knew they were there, and called the office to find out. School staff juggled the calls, the gate and the children at once.",
      did: ["20+ hours riding with school transport, interviews with 20 parents and 10 drivers", "One system for three people: parent app, driver flow, school dashboard", "A notification strategy that balances reassurance and privacy", "Usability tests with drivers, parents and administrators"],
      results: ["12k+ students onboarded in 6 months", "97% parent satisfaction", "85% fewer transport calls", "94% driver ease-of-use"],
      meta: [["Role", "Product designer"], ["Team", "PM, 3 engineers, safety consultant"], ["Time", "14 weeks"]],
    },
    pieces: [
      { id: "cq-system", w: 700, name: "Service · One tap, two people", C: ChegueiSystem, notes: [
        { t: "Designed for two people at once", d: "The parent’s tap and the school’s queue are one event. Both ends were designed together, so each screen shows what the other just did.", a: '[data-target="cheguei"]' },
        { t: "Waiting time in sight", d: "Each arrival carries a running timer, so staff see who has waited longest.", a: ".cqs-timer" },
        { t: "Closed by the school, felt by the parent", d: "Concluir travels back the way Cheguei came: the parent\u2019s card turns Entregue in real time.", a: ".cqs-status" },
        { t: "A message is one tap away", d: "Under Concluir, staff can write to the guardian without leaving the queue.", a: ".cqs-msg" },
      ] },
      { id: "cq-history", w: 900, name: "Desktop · The school's record", C: ChegueiHistory, notes: [
        { t: "Every pickup, on the record", d: "Each tap on the phones becomes a row the school can audit: student, guardian, transport, gate.", a: ".is-new" },
        { t: "Proof for the school", d: "Who warned, who released and who collected, with times: the school's answer when a family asks.", a: ".chh-detail" },
      ] },
    ],
  },
  {
    id: "ai-image-generation", title: "Images for questions, with AI", ...fromProject("ai-image-generation"),
    case: {
      challenge: "Public-school teachers using FTD com Você needed images for questions (math word problems, chemistry formulas) and rarely had them. Generation had to fit inside the activity, respect a daily budget and keep the teacher in charge.",
      did: ["Where AI enters: a visual-support flag on the questions that need it", "Suggestions read from the question, so prompts start filled, never blank", "Four options, feedback and regenerate, under one daily limit shown everywhere", "Error, refusal and limit states, with event tracking for each step"],
      results: ["Concept validation in progress", "Prompt engineering, token management and agent design"],
      meta: [["Role", "Senior product designer, AI workflow"], ["Company", "FTD Educação"], ["Time", "2026"]],
    },
    pieces: [
      { id: "ai-prompt", w: 560, name: "Modal · The AI proposes, the teacher decides", C: AiImgPrompt, notes: [
        { t: "Suggestions from the question itself", d: "The AI reads the question and offers three ideas. Picking one fills the description, which stays editable.", a: ".ai-sugs" },
        { t: "Context travels with the question", d: "Subject, grade and the visual-support flag come along as tags.", a: ".is-rec" },
      ] },
      { id: "ai-options", w: 760, name: "Result · Four options, one daily budget", C: AiImgOptions, notes: [
        { t: "Four takes, one choice", d: "For classroom images, variation beats a single guess; the pick is a radio, the preview expands.", a: '[data-target="opt-1"]' },
        { t: "One budget, said in two places", d: "The toast and the sidebar’s Limites de hoje count the same generation, so the limit never surprises anyone.", a: ".is-img" },
      ] },
    ],
  },
  {
    id: "calendar", title: "Teaching calendar",
    facts: "FTD Educação · 2026 · Web app · EdTech · Integration",
    result: { value: "In progress", label: "", measured: false },
    case: {
      challenge: "Teachers plan the year around holidays (which change by state), themed dates and the materials they generate, and keep all of it in different places. The calendar had to bring these together and reach the agenda they already use.",
      did: ["9 documented flows: browse, region, reminders, create from a day, settings, home widget", "One calendar-item component in 36 variants (format × action × ground × state)", "Google Agenda connection with a one-way sync rule", "A tracking plan of 11 events, reviewed with data and engineering"],
      results: ["In design review with content design", "Ready-for-dev flows for desktop, tablet and phone"],
      meta: [["Role", "Senior product designer"], ["Company", "FTD Educação"], ["Time", "2026"]],
    },
    pieces: [
      { id: "cal-day", w: 860, name: "A day · Themed dates make their own material", C: CalendarDay, notes: [
        { t: "The date suggests the lesson", d: "A themed date offers to create an activity or a lesson plan about itself, with the AI.", a: ".cld-theme" },
        { t: "What you make stays on the day", d: "Generated material and the teacher’s own reminders land in the day and as dots on the month.", a: ".cld-month" },
      ] },
      { id: "cal-sync", w: 720, name: "System · One calendar, two places", C: CalendarSystem, notes: [
        { t: "A sync rule, made visible", d: "Connecting sends the teacher’s own materials and reminders. Holidays and themed dates stay: they already live in every school calendar.", a: '[data-target="status"]' },
        { t: "One way, on purpose", d: "Changes made in Google Agenda never come back, so FTD stays the source of truth for generated materials.", a: ".cls-gcal" },
        { t: "Everything the teacher makes lands here", d: "Activities and lesson plans made with AI offer to join the calendar the moment they are generated.", a: '[data-target="i5"]' },
        { t: "One item, many surfaces", d: "The same item component renders the month chip, the week card and the mobile list.", a: '[data-target="i4"]' },
      ] },
    ],
  },
  {
    id: "ai-writing-assistant", title: "AI Writing Assistant", ...fromProject("ai-writing-assistant"),
    case: {
      challenge: "School messages reach thousands of families. After inappropriate-content incidents in 2025, schools needed moderation, and staff wanted help writing clear, friendly messages without losing control of what was sent.",
      did: ["A moderation-first workflow before writing assistance", "Improve-with-AI on the writer’s own selection, rewritten in place", "Feedback on every rewrite, with a next step in each answer", "A usage dashboard so schools see whether the assistant helps"],
      results: ["Impact metrics coming soon", "Tone and length controls, impact tracking built in"],
      meta: [["Role", "Product designer"], ["Team", "PM, 3 engineers, AI/ML specialist"], ["Time", "10 weeks"]],
    },
    pieces: [
      { id: "wr-loop", w: 740, name: "Loop · Ask, rewrite, rate, measure", C: WritingSystem, notes: [
        { t: "AI on request, on the writer’s words", d: "Nothing is rewritten until the writer selects text and asks; the rewrite lands in the same field.", a: '[data-target="improve"]' },
        { t: "Feedback with a next step", d: "Amei, Quero ajustar or Tente novamente: each answer is also the next action.", a: ".wrs-opts" },
        { t: "The rating feeds the school’s view", d: "Every answer lands in the usage dashboard, so the team sees whether the AI helps before scaling it.", a: ".wrs-dash" },
      ] },
    ],
  },
  {
    id: "lesson-plan-tool", title: "Lesson plans + learning profiles", ...fromProject("lesson-plan-tool"),
    case: {
      challenge: "FTD com Você licensed a third-party lesson-plan tool, and its plans ignored inclusive-education needs. Teachers needed plans by grade, topic and duration that adapt to the students in front of them.",
      did: ["A guided flow by grade, topic and duration", "Learning profiles built from observable needs, reusable across tools", "A profile selector shared by activities and lesson plans", "Prompt engineering for adapted steps the teacher can check"],
      results: ["$8.5k saved per month by replacing the third-party tool", "Inclusive-education ready"],
      meta: [["Role", "Senior product designer, AI workflow"], ["Company", "FTD Educação"], ["Time", "2026"]],
    },
    pieces: [
      { id: "lp-steps", w: 820, name: "Flow · A plan in three simple steps", C: LessonFlow, notes: [
        { t: "Three steps, always in view", d: "Prepare, define, adapt: the stepper says where you are and ticks off what is done.", a: ".lpf-stepper" },
        { t: "A few fields per step", d: "Grade, subject and length; then the theme; then who the plan adapts to. Nothing else is asked.", a: ".lpf-panels" },
        { t: "One button to create", d: "The last step turns Continue into Create lesson plan, so the end of the form is obvious.", a: '[data-target="next"]' },
      ] },
      { id: "lp-profile", w: 780, name: "System · A profile, made once, used everywhere", C: LessonSystem, notes: [
        { t: "Needs, not diagnoses", d: "Teachers describe a group by observable needs from a checklist, never by a medical label.", a: ".lps-traits" },
        { t: "One object, many forms", d: "The profile becomes a chip in the selector used by activities and lesson plans: created once, reused.", a: '[data-target="chip"]' },
        { t: "Adaptations you can see", d: "The plan marks each step the profile changed, so the teacher can check the AI’s choices.", a: ".lps-tag" },
      ] },
    ],
  },
  {
    id: "health-food-delivery", title: "Saúde e Ponto", ...fromProject("health-food-delivery"),
    case: {
      challenge: "Busy professionals open delivery apps wanting something healthy, face hundreds of options and “fitness” labels they can’t trust, and end up ordering pizza again.",
      did: ["18 interviews and a competitive analysis of 8 apps", "Personas and journeys for 4 dietary profiles", "Nutrition shown before checkout, and points for healthy choices", "3 rounds of usability tests with 27 participants"],
      results: ["92% task completion", "8.7/10 satisfaction", "35% faster checkout", "2,500+ Behance views"],
      meta: [["Role", "Solo design and research"], ["Type", "Personal project"], ["Time", "8 weeks"]],
    },
    pieces: [
      { id: "sp-points", w: 700, h: 680, name: "System · Points for healthy choices", C: SaudeSystem, notes: [
        { t: "The reward is on the shelf", d: "A healthy item says what it earns (+1 ponto) next to its labels, before checkout.", a: ".sps-tags" },
        { t: "Picking up pays", d: "The bag offers 10 more points for collecting in store, and shows them before paying.", a: ".sps-seg" },
        { t: "One account, two moments", d: "Points land when the order is paid, and collecting in store is the next reward, kept in one ledger.", a: ".sps-ledger" },
      ] },
      { id: "sp-route", w: 700, h: 680, name: "Flow · Walk to your order", C: SaudeRoute, notes: [
        { t: "How you go is a choice", d: "Bike, walk or run: the app estimates each one before the trip starts.", a: ".spf-modes" },
        { t: "The trip becomes exercise", d: "Speed, calories and heartbeat turn a pickup into a walk worth taking.", a: ".spf-stats" },
        { t: "Paid for showing up", d: "Confirming at the store books 10 more points in the same ledger as the order.", a: ".spf-l-w" },
      ] },
      { id: "sp-stories", w: 700, h: 680, name: "Flow · From recipe to bag", C: SaudeStories, notes: [
        { t: "Stores publish recipes", d: "Markets and restaurants post short videos in Stories, next to what they sell.", a: ".spf-by" },
        { t: "The recipe is the list", d: "The bag icon opens this video’s ingredients, quantities ready, points on each.", a: ".spf-row" },
        { t: "One tap, whole recipe", d: "Every ingredient lands in the bag with its total and its points.", a: ".spf-bagcard" },
      ] },
    ],
  },
  {
    id: "ionic-ai-identity", title: "Mascots for iônica’s AI", ...fromProject("ionic-ai-identity"),
    case: {
      challenge: "Give iônica’s AI a face students and teachers would want to talk to, without the usual robot.",
      did: ["Two characters with two jobs: Lia discovers, íon explains", "Personality moodboards for each", "20+ alternatives explored before the final pair", "Naming with the content designers"],
      results: ["Identity in rollout; impact to be measured"],
      meta: [["Role", "Identity and character design"], ["Team", "AI squad and content team"], ["Time", "2026"]],
    },
    pieces: [
      { id: "ion-art", w: 1040, name: "Lia discovers, íon explains", C: IonArt, notes: [] },
      { id: "ion-sheets", w: 1040, name: "Character sheets", C: IonSheets, notes: [] },
      { id: "ion-moods", w: 1040, name: "Moodboards", C: IonMoods, notes: [] },
    ],
  },
  {
    id: "quest-for-the-next-product", title: "End-to-End: Quest for the Next Product", ...fromProject("quest-for-the-next-product"),
    case: {
      challenge: "Let visitors experience a design career rather than only read about it.",
      did: ["My career as a 2D side-scrolling RPG: each job is a chapter", "Projects as collectible cards, design tools as part of the adventure", "Design and development, responsive end to end"],
      results: ["Playable on desktop and phone"],
      meta: [["Role", "Design and development"], ["Type", "Personal project"], ["Time", "2026"]],
    },
    pieces: [
      { id: "q-play", w: 1040, name: "Play it here · arrows to walk, space to jump", C: QuestPlay, notes: [] },
    ],
  },
];

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
    <div ref={layer} className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
      {pos.map((p, n) => (p ? <span key={n} className="fg-marker" style={{ left: p.x, top: p.y }}>{start + n}</span> : null))}
    </div>
  );
}
