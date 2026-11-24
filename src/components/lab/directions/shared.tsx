/**
 * Shared real content for the /lab/directions mockups (unlinked, preview only).
 * Everything here comes from the live data (featuredProjects / projectsData) or
 * mirrors copy already on Home, Resume and CompanyLogos, so the mockups never
 * invent facts. Nothing in the live site imports this file.
 */
import { useEffect, useState } from "react";
import { featuredProjects, type FeaturedProject } from "@/data/featuredProjects";
import logoSanar from "@/assets/logo-sanar.png";
import logoSebrae from "@/assets/logo-sebrae.png";
import logoCvlb from "@/assets/logo-cvlb.png";
import logoClassapp from "@/assets/logo-classapp.png";
import logoIsaac from "@/assets/logo-isaac.png";
import logoArco from "@/assets/logo-arco.png";
import logoFtd from "@/assets/logo-ftd.png";
import portrait from "@/assets/hero-portrait.png";

export { portrait };
export const projects = featuredProjects;
export type Project = FeaturedProject;

export const person = {
  name: "Rafael Bacellar",
  short: "Rafa",
  role: "Senior Product Designer",
  now: "FTD Educação",
  nowDetail: "Design lead at the AI Center of Excellence for Grupo Marista",
  linkedin: "https://www.linkedin.com/in/rfbcllr/",
  skills: ["UX/UI Design", "AI Tools", "Design Systems", "Research"],
};

/** Mirrors the experience list on /resume. */
export const experience = [
  { role: "Senior Product Designer", company: "FTD Educação", period: "2026 – now", from: 2026 },
  { role: "Product Designer", company: "isaac", period: "2024 – 2026", from: 2024 },
  { role: "Product Designer", company: "ClassApp", period: "2021 – 2024", from: 2021 },
  { role: "Design Analyst", company: "Le biscuit", period: "2019 – 2021", from: 2019 },
  { role: "Design & Marketing Analyst", company: "Sebrae Bahia", period: "2017 – 2019", from: 2017 },
  { role: "Brand Designer", company: "Sanar", period: "2015 – 2016", from: 2015 },
];

export const companies = [
  { name: "FTD Educação", logo: logoFtd },
  { name: "Arco Educação", logo: logoArco },
  { name: "isaac", logo: logoIsaac },
  { name: "ClassApp", logo: logoClassapp },
  { name: "CVLB Group", logo: logoCvlb },
  { name: "Sebrae", logo: logoSebrae },
  { name: "Sanar", logo: logoSanar },
];

/** Short display name per project; the data titles are long or duplicated ("School Transport Feature"). */
export const shortTitle: Record<string, string> = {
  "meu-arco": "Meu Arco",
  "students-transportation": "Cheguei",
  "health-food-delivery": "Saúde e Ponto",
  "ai-writing-assistant": "AI Writing Assistant",
  "ai-image-generation": "AI images for questions",
  "lesson-plan-tool": "Lesson plan generator",
  "credit-transfer-analysis": "Credit transfer analysis",
  "ionic-ai-identity": "Lia & Íon mascots",
  "quest-for-the-next-product": "Quest for the Next Product",
};

/** The outcome line a viewer should read, or an honest status when there is no metric yet. */
export function outcomeOf(p: Project): { value: string; label: string; measured: boolean } {
  if (p.playInsteadOfOutcome) return { value: "Playable", label: "2D RPG portfolio", measured: false };
  if (!p.outcomeValue || p.outcomeValue === "TBD") return { value: "In progress", label: p.outcomeLabel, measured: false };
  return { value: p.outcomeValue.replace("+ $8,5k", "$8.5k"), label: p.outcomeLabel, measured: true };
}

export const projectHref = (p: Project) => (p.playInsteadOfOutcome ? "/play" : `/project/${p.slug}`);

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mql.matches);
    mql.addEventListener("change", on);
    return () => mql.removeEventListener("change", on);
  }, []);
  return reduced;
}

/**
 * Real project media: muted looping video when available (poster under reduced motion), else the image/GIF.
 * Lovable-hosted assets (/__l5e/...) only resolve on the deployed site, so a failed image falls through
 * to the project's next media item and finally to a plain titled tile.
 */
export function Media({ project, index = 0, className = "", eager = false }: { project: Project; index?: number; className?: string; eager?: boolean }) {
  const reduced = useReducedMotion();
  const [attempt, setAttempt] = useState(0);
  const items = project.mediaItems.length ? project.mediaItems : [];
  const item = items[(index + attempt) % Math.max(items.length, 1)];
  const exhausted = attempt >= Math.max(items.length, 1);
  const still = item?.poster ?? item?.src ?? project.poster;
  if (exhausted) {
    return (
      <div className={`${className} grid place-items-center bg-[#DEDBD3] p-4 text-center text-[13px] text-[#55534d]`} role="img" aria-label={project.title}>
        {project.title}
      </div>
    );
  }
  if (item?.sources && !reduced) {
    return (
      <video
        className={className}
        poster={item.poster}
        autoPlay
        muted
        loop
        playsInline
        preload={eager ? "auto" : "metadata"}
        aria-label={item.title}
      >
        {item.sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </video>
    );
  }
  return (
    <img
      key={still}
      className={className}
      src={still}
      alt={item?.title ?? project.title}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setAttempt((a) => a + 1)}
    />
  );
}

/** Loads the Google font families a mockup needs, once, only on the lab page. */
export function useLabFonts() {
  useEffect(() => {
    const id = "lab-directions-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=JetBrains+Mono:wght@400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);
}
