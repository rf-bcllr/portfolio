interface ProjectCardProps {
  title: string;
  src: string;
  href?: string;
}

export function ProjectCard({ title, src, href }: ProjectCardProps) {
  const img = (
    <img
      src={src}
      alt={`${title} — case de produto por Rafael Bacellar`}
      loading="lazy"
      className="h-auto w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
    />
  );

  return (
    <div className="flex h-full w-full items-center justify-center bg-muted/10 p-2 sm:p-3">
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="block w-full">
          {img}
        </a>
      ) : (
        img
      )}
    </div>
  );
}
