import { projectsData } from "@/data/projects";
import { animatedProjectMedia } from "@/data/animatedMedia";
import type { AnimatedMedia } from "@/data/animatedMedia";

export const featuredProjectSlugs = [
  "meu-arco",
  "students-transportation",
  "health-food-delivery",
  "ai-writing-assistant",
  "ai-question-generator",
] as const;

export type FeaturedProjectSlug = (typeof featuredProjectSlugs)[number];

export type FeaturedProject = {
  slug: FeaturedProjectSlug;
  title: string;
  subtitle: string;
  company: string;
  year: number;
  role: string;
  chips: string[];
  emoji: string;
  category: string;
  summary: string;
  duration: string;
  outcome: string;
  outcomeHighlights: string[];
  accent: "blue" | "green" | "amber" | "red";
  mediaPresentation: {
    frame: "phone" | "browser";
    aspect: string;
    maxWidth: string;
    rotate?: string;
  };
  media?: AnimatedMedia;
  poster: string;
  status?: "in-progress";
};

const chipMap: Record<FeaturedProjectSlug, string[]> = {
  "meu-arco": ["Product Design", "Design System", "Research"],
  "students-transportation": ["Mobile", "Service Design", "Research"],
  "health-food-delivery": ["Product Design", "Mobile", "Health"],
  "ai-writing-assistant": ["AI", "Dashboard", "UX Writing"],
  "ai-question-generator": ["AI", "Education", "In progress"],
};

const cardMeta: Record<FeaturedProjectSlug, Pick<FeaturedProject, "emoji" | "category" | "summary" | "outcome" | "outcomeHighlights" | "accent" | "mediaPresentation">> = {
  "meu-arco": {
    emoji: "🎯",
    category: "Web & Mobile App · EdTech",
    summary: "Unified gateway for the Arco Educação ecosystem, designed after 150+ hours of school observation to reduce platform switching, preserve brand identities and adapt the experience by role for teachers, students and administrators.",
    outcome: "10k+ active users across the Arco ecosystem",
    outcomeHighlights: ["45% fewer support tickets", "62% higher engagement time", "20 min/day saved by teachers"],
    accent: "blue",
    mediaPresentation: { frame: "phone", aspect: "aspect-[5/12]", maxWidth: "max-w-[245px]", rotate: "-rotate-2" },
  },
  "students-transportation": {
    emoji: "🚌",
    category: "Mobile App · EdTech · Safety",
    summary: "Safety-focused transportation system shaped by 20+ hours riding school routes and interviews with parents and drivers. The mobile experience reduces anxiety with one-tap driver check-ins, proactive parent notifications and privacy-aware status visibility.",
    outcome: "12k+ students using Cheguei within 6 months",
    outcomeHighlights: ["97% parent satisfaction", "85% fewer transport calls", "94% driver ease-of-use"],
    accent: "blue",
    mediaPresentation: { frame: "phone", aspect: "aspect-[9/18.2]", maxWidth: "max-w-[260px]", rotate: "rotate-2" },
  },
  "health-food-delivery": {
    emoji: "🥗",
    category: "Mobile App · Health · Food Delivery",
    summary: "Nutrition-first delivery concept for busy professionals who wanted healthy meals without decision fatigue. The interface brings calories, macros and meal goals forward while keeping appetite appeal and a 3-step checkout flow.",
    outcome: "92% task completion in usability testing",
    outcomeHighlights: ["8.7/10 satisfaction score", "35% faster checkout", "2,500+ Behance views"],
    accent: "green",
    mediaPresentation: { frame: "browser", aspect: "aspect-[16/9]", maxWidth: "max-w-[560px]", rotate: "rotate-1" },
  },
  "ai-writing-assistant": {
    emoji: "✍️",
    category: "AI Workflow · Dashboard",
    summary: "AI-assisted communication workflow for schools, combining message generation, tone controls, content moderation and an adoption dashboard so teams can monitor communication quality instead of treating AI as a black box.",
    outcome: "Shipped with adoption and quality dashboard",
    outcomeHighlights: ["Tone and length controls", "Moderation-first workflow", "Impact tracking built in"],
    accent: "amber",
    mediaPresentation: { frame: "browser", aspect: "aspect-[16/10]", maxWidth: "max-w-[540px]", rotate: "-rotate-1" },
  },
  "ai-question-generator": {
    emoji: "✨",
    category: "AI Tool · Education",
    summary: "In-progress FTD Educação exploration for generating pedagogical questions inside the reading experience. The card keeps the work honest: process and outcomes stay limited until the real project evidence is documented.",
    outcome: "In progress, with no fabricated impact metrics",
    outcomeHighlights: ["Education AI workflow", "Reader-context generation", "Case study intentionally pending"],
    accent: "red",
    mediaPresentation: { frame: "browser", aspect: "aspect-[16/9]", maxWidth: "max-w-[540px]", rotate: "rotate-1" },
  },
};

export const featuredProjects: FeaturedProject[] = featuredProjectSlugs.map((slug) => {
  const project = projectsData.find((item) => item.slug === slug);

  if (!project) {
    throw new Error(`Featured project not found: ${slug}`);
  }

  return {
    slug,
    title: project.title,
    subtitle: project.subtitle,
    company: project.company,
    year: project.year,
    role: project.overview.role,
    chips: chipMap[slug],
    emoji: cardMeta[slug].emoji,
    category: cardMeta[slug].category,
    summary: cardMeta[slug].summary,
    duration: project.overview.duration,
    outcome: cardMeta[slug].outcome,
    outcomeHighlights: cardMeta[slug].outcomeHighlights,
    accent: cardMeta[slug].accent,
    mediaPresentation: cardMeta[slug].mediaPresentation,
    media: animatedProjectMedia[slug],
    poster: animatedProjectMedia[slug]?.poster ?? project.heroImage,
    status: slug === "ai-question-generator" ? "in-progress" : undefined,
  };
});
