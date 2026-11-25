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
import lia from "@/assets/thumbs/lia.webp";
import quest from "@/assets/thumbs/quest.webp";
import saude from "@/assets/thumbs/saude.webp";
import writing from "@/assets/thumbs/writing.webp";
import { SECTIONS, type Sec } from "@/components/canvas/canvasFrames";

export type Cover = { src: string; alt: string; left: number; top: number; width: number; flat?: boolean };
export type Project = Sec & {
  name: string; line: string; company: string; year: string; ground: string; ratio: number; covers: Cover[];
  /** Stage pieces whose product runs off the foot of the panel */
  bleed: boolean;
  link?: { href: string; label: string };
};

type Look = Omit<Project, keyof Sec | "company" | "year">;

// left / top / width are percentages of the cover (top of its height)
const LOOKS: Record<string, Look> = {
  "meu-arco": {
    name: "Meu Arco", line: "One app for every school, each still itself.", ground: "#3540cf", ratio: 0.8, bleed: true,
    covers: [{ src: arco, alt: "Meu Arco home on a phone", left: 11, top: 14, width: 78 }],
  },
  "students-transportation": {
    name: "Cheguei", line: "One tap tells the school a parent is at the gate.", ground: "#ffc94a", ratio: 1, bleed: true,
    covers: [
      { src: cheguei, alt: "Cheguei, the parent’s phone", left: 6.5, top: 14, width: 48 },
      { src: chegueiStaff, alt: "Cheguei, the school’s phone", left: 45.5, top: 34, width: 48 },
    ],
  },
  "ai-image-generation": {
    name: "AI images", line: "The image a question needs, without leaving it.", ground: "#cfe0f2", ratio: 1, bleed: false,
    covers: [{ src: images, alt: "Generate an image with AI, suggestions from the question", left: 10, top: 9.5, width: 80 }],
  },
  calendar: {
    name: "Calendar", line: "The school year, in the agenda teachers already use.", ground: "#ea5a36", ratio: 1.3, bleed: true,
    covers: [{ src: calendar, alt: "FTD calendar connected to Google Agenda", left: 8, top: 30, width: 108 }],
  },
  "ai-writing-assistant": {
    name: "Writing assistant", line: "Clearer messages to families, rewritten on request.", ground: "#bfe3d0", ratio: 1, bleed: true,
    covers: [{ src: writing, alt: "A school message improved with AI", left: 9, top: 12, width: 82 }],
  },
  "lesson-plan-tool": {
    name: "Lesson plans", line: "Plans that adapt to the students in the room.", ground: "#f5bfd0", ratio: 0.95, bleed: true,
    covers: [{ src: lesson, alt: "Creating a learning profile", left: 10, top: 12.5, width: 80 }],
  },
  "health-food-delivery": {
    name: "Saúde e Ponto", line: "Healthy choices that pay back at checkout.", ground: "#0f6b62", ratio: 0.8, bleed: true,
    covers: [{ src: saude, alt: "Walking to pick up an order, tracked in the app", left: 11, top: 16, width: 78 }],
  },
  "ionic-ai-identity": {
    name: "Lia & Íon", line: "Two characters that give Iônica’s AI a face.", ground: "#ffd3a8", ratio: 0.8, bleed: false,
    covers: [{ src: lia, alt: "Lia, the book explorer", left: 23, top: 14, width: 54, flat: true }],
  },
  "quest-for-the-next-product": {
    name: "Quest", line: "My career as a side-scrolling game.", ground: "#0055ff", ratio: 1.3, bleed: false,
    covers: [{ src: quest, alt: "Quest for the Next Product, 2015 level", left: 8, top: 15.5, width: 84 }],
    link: { href: "/play", label: "Play the game" },
  },
};

export const PROJECTS: Project[] = SECTIONS.map((s) => {
  const [company, year] = s.facts.split(" · ");
  return { ...s, ...LOOKS[s.id], company, year };
});
