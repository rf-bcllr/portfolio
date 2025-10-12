import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-display flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Gallery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedIndex(index);
                  setLightboxOpen(true);
                }}
                className="group relative aspect-video overflow-hidden rounded-lg border border-border bg-muted hover:border-primary transition-all duration-300"
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
        </CardContent>
      </Card>
      
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
