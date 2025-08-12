import React, { useCallback, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Minus, Plus, RotateCcw } from "lucide-react";

export interface MediaItem {
  src: string;
  title?: string;
}

interface MediaLightboxProps {
  items: MediaItem[];
  index: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIndexChange: React.Dispatch<React.SetStateAction<number>>;
}

function isVideo(src: string) {
  return /\.(mp4|webm|ogg|mov)(?:\?|$)/i.test(src);
}

export function MediaLightbox({ items, index, open, onOpenChange, onIndexChange }: MediaLightboxProps) {
  const [zoom, setZoom] = useState(1);

  const current = useMemo(() => items[index], [items, index]);
  const video = useMemo(() => (current ? isVideo(current.src) : false), [current]);

  const next = useCallback(() => {
    onIndexChange((index + 1) % items.length);
    setZoom(1);
  }, [index, items.length, onIndexChange]);

  const prev = useCallback(() => {
    onIndexChange((index - 1 + items.length) % items.length);
    setZoom(1);
  }, [index, items.length, onIndexChange]);

  const zoomIn = () => setZoom((z) => Math.min(3, Number((z + 0.25).toFixed(2))));
  const zoomOut = () => setZoom((z) => Math.max(0.5, Number((z - 0.25).toFixed(2))));
  const resetZoom = () => setZoom(1);

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setZoom(1); }}>
      <DialogContent className="max-w-6xl w-[96vw] h-[88vh] p-0 overflow-hidden">
        <div className="relative size-full bg-background">
          {/* Media area */}
          <div className="absolute inset-0 overflow-auto bg-muted/40">
            <div className="min-h-full flex items-center justify-center p-4">
              {video ? (
                <video
                  src={current?.src}
                  controls
                  className="max-h-[80vh] max-w-full rounded-2xl border border-border bg-black"
                />
              ) : (
                <img
                  src={current?.src}
                  alt={current?.title ?? "Project media"}
                  className="max-h-[80vh] max-w-full rounded-2xl border border-border bg-muted/20"
                  style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
                />
              )}
            </div>
          </div>

          {/* Title */}
          {current?.title && (
            <div className="absolute left-4 top-4 z-10 rounded-full bg-background/80 backdrop-blur px-3 py-1 text-xs border border-border">
              {current.title}
            </div>
          )}

          {/* Controls */}
          <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-2">
            <div className="rounded-full border border-border bg-background/90 backdrop-blur px-2 py-1.5 flex items-center gap-1">
              <Button variant="ghost" size="icon" className="size-8" onClick={prev} aria-label="Previous">
                <ChevronLeft className="size-4" />
              </Button>
              <span className="mx-2 text-sm text-muted-foreground">
                {index + 1} / {items.length}
              </span>
              <Button variant="ghost" size="icon" className="size-8" onClick={next} aria-label="Next">
                <ChevronRight className="size-4" />
              </Button>
            </div>

            {!video && (
              <div className="rounded-full border border-border bg-background/90 backdrop-blur px-2 py-1.5 flex items-center gap-1">
                <Button variant="ghost" size="icon" className="size-8" onClick={zoomOut} aria-label="Zoom out">
                  <Minus className="size-4" />
                </Button>
                <span className="w-10 text-center text-sm tabular-nums">{Math.round(zoom * 100)}%</span>
                <Button variant="ghost" size="icon" className="size-8" onClick={zoomIn} aria-label="Zoom in">
                  <Plus className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="size-8" onClick={resetZoom} aria-label="Reset zoom">
                  <RotateCcw className="size-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MediaLightbox;
