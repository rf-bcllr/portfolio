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
  accent: "blue" | "green" | "amber" | "red";
  mediaLayout: "horizontal" | "vertical";
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

const cardMeta: Record<FeaturedProjectSlug, Pick<FeaturedProject, "emoji" | "category" | "summary" | "outcome" | "accent">> = {
  "meu-arco": {
    emoji: "🎯",
    category: "Web & Mobile App · EdTech",
    summary: "A unified gateway for Arco Educação that replaced fragmented school tools with one role-aware experience for teachers, students and administrators — balancing brand identity, progressive disclosure and cross-platform navigation.",
    outcome: "45% fewer support tickets · 62% higher engagement time",
    accent: "blue",
  },
  "students-transportation": {
    emoji: "🚌",
    category: "Mobile App · EdTech · Safety",
    summary: "A safety-first transportation flow for parents, drivers and school admins: proactive pickup/drop-off notifications, one-tap driver check-ins, privacy-preserving location design and operational dashboards.",
    outcome: "97% parent satisfaction · 85% fewer transportation calls",
    accent: "blue",
  },
  "health-food-delivery": {
    emoji: "🥗",
    category: "Mobile App · Health · Food Delivery",
    summary: "A nutrition-first food delivery concept designed around faster meal discovery, transparent calories/macros before checkout and a 3-step ordering flow that avoids dark patterns and decision fatigue.",
    outcome: "92% task completion · 35% faster checkout in tests",
    accent: "green",
  },
  "ai-writing-assistant": {
    emoji: "✍️",
    category: "AI Workflow · Dashboard",
    summary: "AI support for school communications combining content moderation, contextual writing suggestions, tone/length controls and a dashboard to monitor sent messages, parent NPS and response time.",
    outcome: "Impact tracking pending · shipped with adoption dashboard",
    accent: "amber",
  },
  "ai-question-generator": {
    emoji: "✨",
    category: "AI Tool · Education",
    summary: "An in-progress FTD Educação tool exploring question generation inside the reader experience. The case study is intentionally kept unfinished until the real process and outcomes can be documented.",
    outcome: "In progress · no fabricated impact metrics",
    accent: "red",
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
    accent: cardMeta[slug].accent,
    mediaLayout: project.coverType,
    media: animatedProjectMedia[slug],
    poster: animatedProjectMedia[slug]?.poster ?? project.heroImage,
    status: slug === "ai-question-generator" ? "in-progress" : undefined,
  };
});
