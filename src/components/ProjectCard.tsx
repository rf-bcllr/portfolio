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
  
  return <div data-cursor-action="navigate-internal" className={`group relative overflow-hidden rounded-3xl cursor-pointer ${className}`} onClick={handleClick}>
      <div className="relative w-full">
        <img src={src} alt={alt} className="w-full h-auto object-contain transition-all duration-700 group-hover:scale-105 group-hover:blur-sm" style={{ opacity: imageLoaded ? 1 : 0 }} onLoad={() => setImageLoaded(true)} />
        
        {/* Loading placeholder */}
        {!imageLoaded && <div className="absolute inset-0 bg-muted animate-pulse rounded-3xl" />}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Hover content */}
        <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          <div className="text-white">
            <h3 className="text-lg font-semibold mb-2 title-skew-hover">{title}</h3>
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <Badge key={chip} variant="secondary" className="text-xs bg-white/20 text-white border-white/30 hover:bg-white/30">
                  {chip}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 ring-1 ring-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
      </div>
    </div>;
};