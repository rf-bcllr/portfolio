import { Link } from "react-router-dom";
import { featuredProjects } from "@/data/featuredProjects";

export function ProjectFolder({ className = "" }: { className?: string }) {
  const thumbs = [
    { slug: "ionic-ai-identity", index: 0 },
    { slug: "health-food-delivery", index: 0 },
    { slug: "meu-arco", index: 1 },
  ].flatMap(({ slug, index }) => {
    const project = featuredProjects.find((p) => p.slug === slug);
    if (!project) return [];
    const media = project.mediaItems[index];
    return [{ src: media?.poster ?? media?.src ?? project.poster }];
  });
  const years = featuredProjects.map((p) => p.year);
  const meta = `${featuredProjects.length} projects · ${Math.min(...years)}–${Math.max(...years)}`;

  return (
    <Link
      to="/work"
      data-cursor-action="navigate-internal"
      aria-label={`Selected Cases — ${meta}`}
      className={`pfolder ${className}`}
    >
      <div className="pfolder-art">
        <div className="pfolder-back" aria-hidden="true" />
        {thumbs.map((thumb, i) => (
          <div key={thumb.src} className={`pfolder-sheet pfolder-sheet-${i + 1}`} aria-hidden="true">
            <img src={thumb.src} alt="" loading="lazy" decoding="async" />
          </div>
        ))}
        <div className="pfolder-front" aria-hidden="true" />
      </div>
      <div className="pfolder-label">
        <div className="pfolder-title" style={{ fontFamily: "var(--font-display)" }}>
          Selected Cases
        </div>
        <div className="pfolder-meta" style={{ fontFamily: "var(--font-display)" }}>
          {meta}
        </div>
      </div>
    </Link>
  );
}
