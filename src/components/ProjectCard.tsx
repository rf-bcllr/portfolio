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
  
  return <div data-cursor-action="navigate-internal" className={`group relative overflow-hidden rounded-none cursor-pointer border-2 border-primary/30 ${className}`} onClick={handleClick}>
      <div className="relative w-full">
        {/* Corner Brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary z-10" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary z-10" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary z-10" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary z-10" />
        
        {/* Status Indicator */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-technical-pulse" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">ACTIVE</span>
        </div>
        
        {/* Project ID */}
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/50 rounded-none px-2 py-0.5">
            PROJECT_{String(index + 1).padStart(2, '0')}
          </Badge>
        </div>

        <img src={src} alt={alt} className="w-full h-auto object-contain transition-all duration-700 group-hover:scale-105 group-hover:blur-sm" style={{ opacity: imageLoaded ? 1 : 0 }} onLoad={() => setImageLoaded(true)} />
        
        {/* Loading placeholder */}
        {!imageLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
        
        {/* Overlay with grid pattern */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Hover content */}
        <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          <div className="text-foreground">
            <h3 className="text-lg font-bold mb-2 uppercase tracking-wide font-display">{title}</h3>
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <Badge key={chip} variant="secondary" className="text-xs font-bold uppercase bg-primary/30 text-foreground border border-primary hover:bg-primary hover:text-primary-foreground rounded-none">
                  {chip}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        {/* Technical Glow */}
        <div className="absolute inset-0 ring-2 ring-primary/0 opacity-0 group-hover:opacity-100 group-hover:ring-primary/50 transition-all duration-500" 
             style={{ boxShadow: '0 0 20px hsl(var(--primary) / 0.3)' }} />
      </div>
    </div>;
};