import { useEffect, useRef, useState } from "react";
import { Disc3, X } from "lucide-react";

const PLAYLIST_ID = "3wIcvT1o526tAiSwZ9q7aH";
const EMBED_SRC = `https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator&theme=0`;

export function DJWidget() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="dj-widget-panel"
        aria-label={open ? "Close DJ player" : "Open DJ player"}
        data-cursor-action="dj-toggle"
        className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-transparent px-3 text-xs font-semibold leading-none text-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Disc3 className={`size-4 ${open ? "animate-spin" : ""}`} aria-hidden="true" />
        <span className="hidden sm:inline">DJ</span>
      </button>

      {open && (
        <div
          ref={panelRef}
          id="dj-widget-panel"
          role="dialog"
          aria-label="DJ player"
          className="absolute right-0 top-full z-50 mt-3 w-[320px] overflow-hidden rounded-[20px] border-2 border-foreground/90 bg-card shadow-[6px_6px_0_hsl(var(--foreground))]"
        >
          <div className="flex items-center justify-between border-b-2 border-foreground/90 bg-primary px-3 py-2">
            <div className="flex items-center gap-2 text-primary-foreground">
              <Disc3 className="size-4 animate-spin" aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-[0.12em]">
                Now spinning
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close DJ player"
              className="inline-flex size-6 items-center justify-center rounded-full text-primary-foreground/90 hover:bg-primary-foreground/20"
            >
              <X className="size-3.5" />
            </button>
          </div>
          <iframe
            title="Spotify DJ playlist"
            src={EMBED_SRC}
            width="100%"
            height="352"
            frameBorder={0}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="block"
          />
        </div>
      )}
    </div>
  );
}
