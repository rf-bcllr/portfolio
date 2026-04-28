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

export type FeaturedProjectMediaPresentation = {
  frame: "phone" | "browser";
  aspect: string;
  maxWidth: string;
  rotate?: string;
};

export type FeaturedProjectMediaItem = {
  title: string;
  src?: string;
  sources?: AnimatedMedia["sources"];
  poster?: string;
  presentation: FeaturedProjectMediaPresentation;
};

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
  durationDisplay: string;
  roleDisplay: string;
  outcome: string;
  outcomeHighlights: string[];
  accent: "blue" | "green" | "amber" | "red";
  mediaPresentation: FeaturedProjectMediaPresentation;
  mediaItems: FeaturedProjectMediaItem[];
  media?: AnimatedMedia;
  poster: string;
  status?: "in-progress";
};

const browserFrame = (maxWidth = "max-w-[560px]", rotate?: string): FeaturedProjectMediaPresentation => ({
  frame: "browser",
  aspect: "aspect-[16/9]",
  maxWidth,
  rotate,
});

const phoneFrame = (maxWidth = "max-w-[260px]", rotate?: string): FeaturedProjectMediaPresentation => ({
  frame: "phone",
  aspect: "aspect-[9/18.2]",
  maxWidth,
  rotate,
});

const chipMap: Record<FeaturedProjectSlug, string[]> = {
  "meu-arco": ["Product Design", "Design System", "Research"],
  "students-transportation": ["Mobile", "Service Design", "Research"],
  "health-food-delivery": ["Product Design", "Mobile", "Health"],
  "ai-writing-assistant": ["AI", "Dashboard", "UX Writing"],
  "ai-question-generator": ["AI", "Education", "In progress"],
};

const cardMeta: Record<FeaturedProjectSlug, Pick<FeaturedProject, "emoji" | "category" | "summary" | "durationDisplay" | "roleDisplay" | "outcome" | "outcomeHighlights" | "accent" | "mediaPresentation">> = {
  "meu-arco": {
    emoji: "🎯",
    category: "Web & Mobile App · EdTech",
    summary: "A unified product experience for Arco Educação, merging overlapping school workflows into one modular app with Gravity as the design system foundation.",
    durationDisplay: "16 weeks",
    roleDisplay: "Product designer · Research to handoff",
    outcome: "App rating 2.9 → 4.8★",
    outcomeHighlights: ["SUS score 90", "100% rollout ahead of schedule", "35% fewer support tickets"],
    accent: "blue",
    mediaPresentation: { frame: "phone", aspect: "aspect-[5/12]", maxWidth: "max-w-[245px]", rotate: "-rotate-2" },
  },
  "students-transportation": {
    emoji: "🚌",
    category: "Mobile App · EdTech · Safety",
    summary: "A safety-first transportation flow built around the morning anxiety of parents and the limited attention of drivers, turning pickup and drop-off into a clear, proactive mobile experience.",
    durationDisplay: "14 weeks · Q2–Q3 2023",
    roleDisplay: "Product designer",
    outcome: "12k+ students in 6 months",
    outcomeHighlights: ["97% parent satisfaction", "85% fewer transport calls", "94% driver ease-of-use"],
    accent: "blue",
    mediaPresentation: { frame: "phone", aspect: "aspect-[9/18.2]", maxWidth: "max-w-[260px]", rotate: "rotate-2" },
  },
  "health-food-delivery": {
    emoji: "🥗",
    category: "Mobile App · Health · Food Delivery",
    summary: "A health-focused delivery concept that makes nutrition visible before checkout, reducing decision fatigue while keeping the interface fast, appetizing and commercially familiar.",
    durationDisplay: "8 weeks",
    roleDisplay: "Solo design & research",
    outcome: "92% task completion",
    outcomeHighlights: ["8.7/10 satisfaction score", "35% faster checkout", "2,500+ Behance views"],
    accent: "green",
    mediaPresentation: { frame: "browser", aspect: "aspect-[16/9]", maxWidth: "max-w-[560px]", rotate: "rotate-1" },
  },
  "ai-writing-assistant": {
    emoji: "✍️",
    category: "AI Workflow · Dashboard",
    summary: "An AI layer for school communications that pairs moderation safeguards with writing assistance, giving teams more control over tone, clarity and the quality of messages sent to families.",
    durationDisplay: "10 weeks · Q2–Q3 2025",
    roleDisplay: "Product designer",
    outcome: "Dashboard shipped",
    outcomeHighlights: ["Tone and length controls", "Moderation-first workflow", "Impact tracking built in"],
    accent: "amber",
    mediaPresentation: { frame: "browser", aspect: "aspect-[16/10]", maxWidth: "max-w-[540px]", rotate: "-rotate-1" },
  },
  "ai-question-generator": {
    emoji: "✨",
    category: "AI Tool · Education",
    summary: "An AI workflow exploration for generating pedagogical questions directly inside the FTD reader, keeping authoring close to the learning context.",
    durationDisplay: "2025 · in progress",
    roleDisplay: "Product designer · AI workflow exploration",
    outcome: "Concept validation in progress",
    outcomeHighlights: ["Reader-context generation", "Education AI workflow", "FTD learning environment"],
    accent: "red",
    mediaPresentation: { frame: "browser", aspect: "aspect-[16/9]", maxWidth: "max-w-[540px]", rotate: "rotate-1" },
  },
};

const presentationBySlug: Partial<Record<FeaturedProjectSlug, FeaturedProject["mediaPresentation"][]>> = {
  "meu-arco": [
    { frame: "phone", aspect: "aspect-[5/12]", maxWidth: "max-w-[245px]", rotate: "-rotate-2" },
    browserFrame("max-w-[560px]", "rotate-1"),
  ],
  "students-transportation": [phoneFrame("max-w-[260px]", "rotate-2"), phoneFrame("max-w-[260px]", "-rotate-1")],
  "health-food-delivery": [phoneFrame("max-w-[275px]", "-rotate-1"), phoneFrame("max-w-[275px]", "rotate-1")],
  "ai-writing-assistant": [browserFrame("max-w-[560px]", "-rotate-1"), browserFrame("max-w-[560px]", "rotate-1")],
  "ai-question-generator": [browserFrame("max-w-[540px]", "rotate-1"), browserFrame("max-w-[540px]", "-rotate-1")],
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
    durationDisplay: cardMeta[slug].durationDisplay,
    roleDisplay: cardMeta[slug].roleDisplay,
    outcome: cardMeta[slug].outcome,
    outcomeHighlights: cardMeta[slug].outcomeHighlights,
    accent: cardMeta[slug].accent,
    mediaPresentation: cardMeta[slug].mediaPresentation,
    mediaItems: [
      ...(animatedProjectMedia[slug]
        ? [{ title: `${project.title} motion preview`, sources: animatedProjectMedia[slug].sources, poster: animatedProjectMedia[slug].poster }]
        : []),
      ...(project.gallery ?? [{ src: project.heroImage, title: project.title }]).filter(
        (item) => item.src !== animatedProjectMedia[slug]?.poster && !animatedProjectMedia[slug]?.sources.some((source) => source.src === item.src)
      ),
    ].map((item, itemIndex) => ({
      ...item,
      presentation: presentationBySlug[slug]?.[itemIndex] ?? cardMeta[slug].mediaPresentation,
    })),
    media: animatedProjectMedia[slug],
    poster: animatedProjectMedia[slug]?.poster ?? project.heroImage,
    status: slug === "ai-question-generator" ? "in-progress" : undefined,
  };
});
