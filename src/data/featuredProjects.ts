import { projectsData } from "@/data/projects";
import { animatedProjectMedia } from "@/data/animatedMedia";
import type { AnimatedMedia } from "@/data/animatedMedia";
import type { VideoSource } from "@/components/MediaThumb";

export const featuredProjectSlugs = [
  "meu-arco",
  "students-transportation",
  "health-food-delivery",
  "ai-writing-assistant",
  "ai-question-generator",
] as const;

export type FeaturedProjectSlug = (typeof featuredProjectSlugs)[number];
export type FeaturedProjectMediaOrientation = "horizontal" | "vertical" | "square";

export type FeaturedProjectMediaPresentation = {
  frame: "phone" | "browser";
  aspect: string;
  maxWidth: string;
  rotate?: string;
  orientation: FeaturedProjectMediaOrientation;
};

export type FeaturedProjectMediaItem = {
  title: string;
  src?: string;
  sources?: AnimatedMedia["sources"];
  poster?: string;
  orientation: FeaturedProjectMediaOrientation;
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

type RawFeaturedMediaItem = Omit<FeaturedProjectMediaItem, "presentation"> & {
  aspect?: string;
  maxWidth?: string;
  rotate?: string;
};

const VIDEO_EXT_RE = /\.(mp4|webm|ogg|mov)(?:\?|$)/i;

const sourceTypeFromSrc = (src: string): string => {
  if (/\.webm(?:\?|$)/i.test(src)) return "video/webm";
  if (/\.ogg(?:\?|$)/i.test(src)) return "video/ogg";
  if (/\.mov(?:\?|$)/i.test(src)) return "video/quicktime";
  return "video/mp4";
};

const resolveMediaPresentation = ({
  orientation,
  aspect,
  maxWidth,
  rotate,
}: {
  orientation: FeaturedProjectMediaOrientation;
  aspect?: string;
  maxWidth?: string;
  rotate?: string;
;}): FeaturedProjectMediaPresentation => {
  if (orientation === "vertical") {
    return {
      frame: "phone",
      orientation,
      aspect: aspect ?? "aspect-[9/18.2]",
      maxWidth: maxWidth ?? "max-w-[260px]",
      rotate,
    };
  }

  if (orientation === "square") {
    return {
      frame: "browser",
      orientation,
      aspect: aspect ?? "aspect-square",
      maxWidth: maxWidth ?? "max-w-[440px]",
      rotate,
    };
  }

  return {
    frame: "browser",
    orientation,
    aspect: aspect ?? "aspect-[16/10]",
    maxWidth: maxWidth ?? "max-w-[560px]",
    rotate,
  };
};

const chipMap: Record<FeaturedProjectSlug, string[]> = {
  "meu-arco": ["Product Design", "Design System", "Research"],
  "students-transportation": ["Mobile", "Service Design", "Research"],
  "health-food-delivery": ["Product Design", "Mobile", "Health"],
  "ai-writing-assistant": ["AI", "Dashboard", "UX Writing"],
  "ai-question-generator": ["AI", "Education", "In progress"],
};

const cardMeta: Record<FeaturedProjectSlug, Pick<FeaturedProject, "emoji" | "category" | "summary" | "durationDisplay" | "roleDisplay" | "outcome" | "outcomeHighlights" | "accent"> & { mediaPresentation: FeaturedProjectMediaPresentation }> = {
  "meu-arco": {
    emoji: "🎯",
    category: "Web & Mobile App · EdTech",
    summary: "A unified product experience for Arco Educação, merging overlapping school workflows into one modular app with Gravity as the design system foundation.",
    durationDisplay: "16 weeks",
    roleDisplay: "Product designer · Research to handoff",
    outcome: "App rating 2.9 → 4.8★",
    outcomeHighlights: ["SUS score 90", "100% rollout ahead of schedule", "35% fewer support tickets"],
    accent: "blue",
    mediaPresentation: resolveMediaPresentation({ orientation: "vertical", aspect: "aspect-[5/12]", maxWidth: "max-w-[245px]", rotate: "-rotate-2" }),
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
    mediaPresentation: resolveMediaPresentation({ orientation: "vertical", rotate: "rotate-2" }),
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
    mediaPresentation: resolveMediaPresentation({ orientation: "horizontal", aspect: "aspect-[1920/1031]", maxWidth: "max-w-[575px]", rotate: "-rotate-1" }),
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
    mediaPresentation: resolveMediaPresentation({ orientation: "horizontal", aspect: "aspect-[1200/732]", maxWidth: "max-w-[560px]", rotate: "-rotate-1" }),
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
    mediaPresentation: resolveMediaPresentation({ orientation: "horizontal", aspect: "aspect-[1200/646]", maxWidth: "max-w-[540px]", rotate: "rotate-1" }),
  },
};

const orientationBySlug: Record<FeaturedProjectSlug, FeaturedProjectMediaOrientation[]> = {
  "meu-arco": ["vertical", "horizontal"],
  "students-transportation": ["vertical"],
  "health-food-delivery": ["horizontal", "horizontal"],
  "ai-writing-assistant": ["horizontal", "horizontal"],
  "ai-question-generator": ["horizontal"],
};

const presentationOverrides: Partial<Record<FeaturedProjectSlug, Array<Partial<Pick<RawFeaturedMediaItem, "aspect" | "maxWidth" | "rotate">>>>> = {
  "meu-arco": [
    { aspect: "aspect-[5/12]", maxWidth: "max-w-[245px]", rotate: "-rotate-2" },
    { aspect: "aspect-[1972/1616]", maxWidth: "max-w-[520px]", rotate: "rotate-1" },
  ],
  "students-transportation": [{ maxWidth: "max-w-[260px]", rotate: "rotate-2" }],
  "health-food-delivery": [
    { aspect: "aspect-[1920/1031]", maxWidth: "max-w-[575px]", rotate: "-rotate-1" },
    { aspect: "aspect-[1920/1031]", maxWidth: "max-w-[575px]", rotate: "rotate-1" },
  ],
  "ai-writing-assistant": [
    { aspect: "aspect-[1200/732]", maxWidth: "max-w-[560px]", rotate: "-rotate-1" },
    { aspect: "aspect-[1200/750]", maxWidth: "max-w-[560px]", rotate: "rotate-1" },
  ],
  "ai-question-generator": [{ aspect: "aspect-[1200/646]", maxWidth: "max-w-[540px]", rotate: "rotate-1" }],
};

const explicitMediaBySlug: Partial<Record<FeaturedProjectSlug, RawFeaturedMediaItem[]>> = {
  "ai-writing-assistant": [
    {
      title: "AI Writing Assistant motion preview",
      sources: animatedProjectMedia["ai-writing-assistant"].sources,
      poster: animatedProjectMedia["ai-writing-assistant"].poster,
      orientation: "horizontal",
    },
    {
      title: "Communications dashboard usage view",
      sources: animatedProjectMedia["ai-comms-dashboard"].sources,
      poster: animatedProjectMedia["ai-comms-dashboard"].poster,
      orientation: "horizontal",
    },
  ],
  "ai-question-generator": [
    {
      title: "AI Question Generator inside the FTD reader",
      sources: animatedProjectMedia["ai-question-generator"].sources,
      poster: animatedProjectMedia["ai-question-generator"].poster,
      orientation: "horizontal",
    },
  ],
};

const assetKeyForItem = (item: Pick<RawFeaturedMediaItem, "src" | "sources" | "poster">) =>
  item.sources?.map((source) => source.src).join("|") ?? item.src ?? item.poster ?? "";

const normalizeGalleryItem = (
  item: { src: string; title: string },
  orientation: FeaturedProjectMediaOrientation
): RawFeaturedMediaItem => {
  if (VIDEO_EXT_RE.test(item.src)) {
    return {
      title: item.title,
      sources: [{ src: item.src, type: sourceTypeFromSrc(item.src) }] satisfies VideoSource[],
      orientation,
    };
  }

  return {
    title: item.title,
    src: item.src,
    orientation,
  };
};

const dedupeMediaItems = (items: RawFeaturedMediaItem[]) => {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = assetKeyForItem(item);
    if (!key || seen.has(key)) return false;

    seen.add(key);
    return true;
  });
};

const buildMediaItems = (slug: FeaturedProjectSlug, project: NonNullable<ReturnType<typeof projectsData.find>>): FeaturedProjectMediaItem[] => {
  const rawItems = explicitMediaBySlug[slug] ?? [
    ...(animatedProjectMedia[slug]
      ? [{
          title: `${project.title} motion preview`,
          sources: animatedProjectMedia[slug].sources,
          poster: animatedProjectMedia[slug].poster,
          orientation: orientationBySlug[slug][0],
        }]
      : []),
    ...(project.gallery ?? [{ src: project.heroImage, title: project.title }]).map((item, itemIndex) =>
      normalizeGalleryItem(item, orientationBySlug[slug][itemIndex + (animatedProjectMedia[slug] ? 1 : 0)] ?? orientationBySlug[slug][itemIndex] ?? "horizontal")
    ),
  ];

  const animatedPoster = animatedProjectMedia[slug]?.poster;
  const uniqueItems = dedupeMediaItems(
    rawItems.filter((item) => item.src !== animatedPoster)
  );

  return uniqueItems.map((item, itemIndex) => {
    const override = presentationOverrides[slug]?.[itemIndex];
    const presentation = resolveMediaPresentation({
      orientation: item.orientation,
      aspect: item.aspect ?? override?.aspect,
      maxWidth: item.maxWidth ?? override?.maxWidth,
      rotate: item.rotate ?? override?.rotate,
    });

    return {
      title: item.title,
      src: item.src,
      sources: item.sources,
      poster: item.poster,
      orientation: item.orientation,
      presentation,
    };
  });
};

export const featuredProjects: FeaturedProject[] = featuredProjectSlugs.map((slug) => {
  const project = projectsData.find((item) => item.slug === slug);

  if (!project) {
    throw new Error(`Featured project not found: ${slug}`);
  }

  const mediaItems = buildMediaItems(slug, project);

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
    mediaPresentation: mediaItems[0]?.presentation ?? cardMeta[slug].mediaPresentation,
    mediaItems,
    media: animatedProjectMedia[slug],
    poster: mediaItems[0]?.poster ?? mediaItems[0]?.src ?? animatedProjectMedia[slug]?.poster ?? project.heroImage,
    status: slug === "ai-question-generator" ? "in-progress" : undefined,
  };
});
