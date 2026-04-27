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
    summary: "Unified fragmented tools across Arco Educação into one role-aware gateway for teachers, students and administrators.",
    outcome: "45% reduction in support tickets",
    accent: "blue",
  },
  "students-transportation": {
    emoji: "🚌",
    category: "Mobile App · EdTech · Safety",
    summary: "Designed a school transportation tracking system focused on parent reassurance, driver safety and school operations.",
    outcome: "97% parent satisfaction",
    accent: "blue",
  },
  "health-food-delivery": {
    emoji: "🥗",
    category: "Mobile App · Health · Food Delivery",
    summary: "Created a health-first food delivery experience with upfront nutrition, faster checkout and clearer meal discovery.",
    outcome: "92% task completion rate",
    accent: "green",
  },
  "ai-writing-assistant": {
    emoji: "✍️",
    category: "AI Workflow · Dashboard",
    summary: "Designed an AI-assisted writing workflow to help teams draft, review and improve communication with more consistency.",
    outcome: "AI-assisted writing workflow",
    accent: "amber",
  },
  "ai-question-generator": {
    emoji: "✨",
    category: "AI Tool · Education",
    summary: "Exploring a question generation tool for education teams, currently kept as an in-progress case study.",
    outcome: "In progress",
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
    media: animatedProjectMedia[slug],
    poster: animatedProjectMedia[slug]?.poster ?? project.heroImage,
    status: slug === "ai-question-generator" ? "in-progress" : undefined,
  };
});
