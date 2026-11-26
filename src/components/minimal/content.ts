/**
 * The minimal direction's own layer over the canvas content: a short name, one line, a ground
 * colour and how the cover sits on it. Case facts, notes and stage pieces come from canvasFrames.
 */
import arco from "@/assets/thumbs/arco.webp";
import calendar from "@/assets/thumbs/calendar.webp";
import cheguei from "@/assets/thumbs/cheguei.webp";
import chegueiStaff from "@/assets/thumbs/cheguei-staff.webp";
import images from "@/assets/thumbs/images.webp";
import lesson from "@/assets/thumbs/lesson.webp";
import lia from "@/assets/ionic-local/lia-hover.webp";
import quest from "@/assets/quest-local/quest-cover.webp";
import saude from "@/assets/thumbs/saude.webp";
import writing from "@/assets/thumbs/writing.webp";
import { SECTIONS, type Sec } from "@/components/canvas/canvasFrames";

export type Cover = { src: string; alt: string; left: number; top: number; width: number; flat?: boolean; round?: string };
export type Project = Sec & {
  name: string; line: string; company: string; year: string; ground: string; ratio: number; covers: Cover[];
  /** Stage pieces whose product runs off the foot of the panel */
  bleed: boolean;
  /** A shorter name for the index under the covers */
  short?: string;
  /** The cover is one picture: it zooms gently instead of lifting its screens */
  still?: boolean;
  link?: { href: string; label: string };
};

type Look = Omit<Project, keyof Sec | "company" | "year">;

// left / top / width are percentages of the cover (top of its height)
const LOOKS: Record<string, Look> = {
  "meu-arco": {
    name: "Meu Arco", line: "One app for every school, each still itself.", ground: "#3540cf", ratio: 0.8, bleed: true,
    covers: [{ src: arco, alt: "Meu Arco home on a phone", left: 11, top: 14, width: 78, round: "14% / 6.7%" }],
  },
  "students-transportation": {
    name: "Cheguei", line: "One tap tells the school a parent is at the gate.", ground: "#ffc94a", ratio: 1, bleed: true,
    covers: [
      { src: cheguei, alt: "Cheguei, the parent’s phone", left: 6.5, top: 14, width: 48, round: "9% / 4.2%" },
      { src: chegueiStaff, alt: "Cheguei, the school’s phone", left: 45.5, top: 34, width: 48, round: "9% / 4.2%" },
    ],
  },
  "ai-image-generation": {
    name: "AI images", line: "The image a question needs, without leaving it.", ground: "#cfe0f2", ratio: 1, bleed: false,
    covers: [{ src: images, alt: "Generate an image with AI, suggestions from the question", left: 10, top: 9.5, width: 80, round: "3.8% / 4.1%" }],
  },
  calendar: {
    name: "Teaching calendar", line: "The school year, its themed dates and every lesson, in one calendar.", ground: "#ea5a36", ratio: 1.3, bleed: true,
    covers: [{ src: calendar, alt: "FTD calendar connected to Google Agenda", left: 8, top: 30, width: 108, round: "1.9% / 2.8%" }],
  },
  "ai-writing-assistant": {
    name: "Writing assistant", line: "Clearer messages to families, rewritten on request.", ground: "#bfe3d0", ratio: 1, bleed: true,
    covers: [{ src: writing, alt: "A school message improved with AI", left: 9, top: 12, width: 82, round: "2.7%" }],
  },
  "lesson-plan-tool": {
    name: "Lesson plans", line: "Plans that adapt to the students in the room.", ground: "#f5bfd0", ratio: 0.95, bleed: true,
    covers: [{ src: lesson, alt: "Creating a learning profile", left: 10, top: 12.5, width: 80, round: "3.5%" }],
  },
  "health-food-delivery": {
    name: "Saúde e Ponto", line: "Healthy choices that pay back at checkout.", ground: "#0f6b62", ratio: 0.8, bleed: true,
    covers: [{ src: saude, alt: "Walking to pick up an order, tracked in the app", left: 11, top: 16, width: 78, round: "14% / 6.7%" }],
  },
  "ionic-ai-identity": {
    name: "Mascots for iônica’s AI", short: "iônica mascots", line: "Lia and íon, two characters that give iônica’s AI a face.", ground: "#e7dcff", ratio: 0.8, bleed: false,
    covers: [{ src: lia, alt: "Lia on her star hovercraft", left: 8, top: 16, width: 84, flat: true }],
  },
  "quest-for-the-next-product": {
    name: "End-to-End: Quest for the Next Product", short: "Playable portfolio", still: true, line: "My career as a side-scrolling game you can play.", ground: "#dfe6ff", ratio: 1.3, bleed: false,
    covers: [{ src: quest, alt: "End-to-End Quest for the Next Product", left: 0, top: 0, width: 100, flat: true }],
    link: { href: "/play", label: "Play the game" },
  },
};

export const PROJECTS: Project[] = SECTIONS.map((s) => {
  const [company, year] = s.facts.split(" · ");
  return { ...s, ...LOOKS[s.id], company, year };
});
