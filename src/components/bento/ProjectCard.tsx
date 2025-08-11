interface ProjectCardProps {
  title: string;
  src: string;
  href?: string;
  language?: "pt" | "en";
}

export function ProjectCard({ title, src, href, language = "pt" }: ProjectCardProps) {
  const alt =
    language === "pt"
      ? `${title} — estudo de caso de produto por Rafael Bacellar`
      : `${title} — product design case by Rafael Bacellar`;

  const img = (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
    />
  );

  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className="block w-full h-full">
      {img}
    </a>
  ) : (
    img
  );
}

