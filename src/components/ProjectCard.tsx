import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  src: string;
  alt: string;
  title: string;
  chips: string[];
  index: number;
  slug?: string;
  className?: string;
}
export const ProjectCard = ({
  src,
  alt,
  title,
  chips,
  index,
  slug,
  className = ""
}: ProjectCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (slug) {
      navigate(`/project/${slug}`);
    }
  };
  
  return <div data-cursor-action="navigate-internal" className={`group relative overflow-hidden rounded-[20px] cursor-pointer border border-border bg-card shadow-[0_1px_3px_0_hsl(220_20%_20%/0.06),0_1px_2px_-1px_hsl(220_20%_20%/0.06)] transition-all duration-300 hover:shadow-[0_10px_30px_-10px_hsl(220_50%_50%/0.15)] hover:-translate-y-1 hover:border-primary/30 ${className}`} onClick={handleClick}>
      <div className="relative w-full">
        <img src={src} alt={alt} className="w-full h-auto object-contain transition-all duration-500 group-hover:scale-[1.02]" style={{ opacity: imageLoaded ? 1 : 0 }} onLoad={() => setImageLoaded(true)} />
        
        {/* Loading placeholder */}
        {!imageLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
        
        {/* Overlay gradient - always dark for contrast with white text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Hover content */}
        <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white drop-shadow-md">{title}</h3>
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <Badge key={chip} variant="secondary" className="text-xs bg-white/95 text-neutral-900 border-transparent shadow-sm">
                  {chip}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>;
};