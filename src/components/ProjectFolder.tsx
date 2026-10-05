import { Link } from "react-router-dom";
import { featuredProjects } from "@/data/featuredProjects";

export function ProjectFolder({ className = "" }: { className?: string }) {
  const thumbs = featuredProjects.slice(0, 3).map((p) => ({ src: p.poster, alt: p.title }));
  const years = featuredProjects.map((p) => p.year);
  const meta = `${featuredProjects.length} projects · ${Math.min(...years)}–${Math.max(...years)}`;

  return (
    <Link
      to="/work"
      data-cursor-action="navigate-internal"
      aria-label={`View work — ${meta}`}
      className={`pfolder block w-[176px] shrink-0 sm:w-[200px] ${className}`}
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
          Selected Work
        </div>
        <div className="pfolder-meta" style={{ fontFamily: "var(--font-display)" }}>
          {meta}
        </div>
      </div>
    </Link>
  );
}
