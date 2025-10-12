import { useState } from "react";
import { MediaLightbox, MediaItem } from "@/components/MediaLightbox";
import { ImageIcon } from "lucide-react";

interface ProjectGalleryProps {
  images: MediaItem[];
}

export function ProjectGallery({ images }: ProjectGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <>
      <div className="space-y-3">
        <h3 className="text-xl font-display flex items-center gap-2 px-1">
          <ImageIcon className="w-4 h-4" />
          Gallery
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedIndex(index);
                setLightboxOpen(true);
              }}
              className="group relative aspect-video overflow-hidden rounded-lg bg-muted hover:ring-2 hover:ring-primary transition-all duration-300"
              aria-label={`View ${image.title || 'image'} in full size`}
            >
              <img
                src={image.src}
                alt={image.title || `Gallery image ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </button>
          ))}
        </div>
      </div>
      
      <MediaLightbox
        items={images}
        index={selectedIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        onIndexChange={setSelectedIndex}
      />
    </>
  );
}
