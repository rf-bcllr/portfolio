import { useEffect, useRef, useState } from "react";
import { Disc3, Pause, Play, Volume2, VolumeX, X } from "lucide-react";

const PLAYLIST_ID = "3wIcvT1o526tAiSwZ9q7aH";
const PLAYLIST_URI = `spotify:playlist:${PLAYLIST_ID}`;

type SpotifyController = {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  resume: () => void;
  destroy: () => void;
  addListener: (event: string, cb: (e: { data: { isPaused: boolean; isBuffering: boolean } }) => void) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (IFrameAPI: {
      createController: (
        element: HTMLElement,
        options: { uri: string; width: string | number; height: string | number },
        cb: (controller: SpotifyController) => void
      ) => void;
    }) => void;
  }
}

let apiScriptInjected = false;
const apiReadyCallbacks: Array<(api: NonNullable<Parameters<NonNullable<Window["onSpotifyIframeApiReady"]>>[0]>) => void> = [];
let cachedApi: Parameters<NonNullable<Window["onSpotifyIframeApiReady"]>>[0] | null = null;

function loadSpotifyApi(cb: (api: NonNullable<typeof cachedApi>) => void) {
  if (cachedApi) return cb(cachedApi);
  apiReadyCallbacks.push(cb);
  if (apiScriptInjected) return;
  apiScriptInjected = true;
  window.onSpotifyIframeApiReady = (api) => {
    cachedApi = api;
    apiReadyCallbacks.forEach((fn) => fn(api));
    apiReadyCallbacks.length = 0;
  };
  const s = document.createElement("script");
  s.src = "https://open.spotify.com/embed/iframe-api/v1";
  s.async = true;
  document.body.appendChild(s);
}

export function DJWidget() {
  const [open, setOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const embedHostRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<SpotifyController | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Initialize Spotify IFrame controller once, keep it mounted forever.
  useEffect(() => {
    if (!embedHostRef.current || controllerRef.current) return;
    const host = embedHostRef.current;
    loadSpotifyApi((api) => {
      api.createController(
        host,
        { uri: PLAYLIST_URI, width: "100%", height: 352 },
        (controller) => {
          controllerRef.current = controller;
          controller.addListener("playback_update", (e) => {
            setIsPlaying(!e.data.isPaused);
          });
          // Capture the created iframe so we can mute it via the audio track.
          iframeRef.current = host.querySelector("iframe");
          if (iframeRef.current) {
            iframeRef.current.setAttribute("title", "Spotify DJ playlist");
            iframeRef.current.setAttribute("loading", "lazy");
            iframeRef.current.allow =
              "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
          }
        }
      );
    });
  }, []);

  // Close panel on outside click / Escape (does NOT stop playback).
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current && !panelRef.current.contains(t)) {
        // Don't close if user clicked the trigger controls themselves
        const trigger = document.getElementById("dj-widget-trigger-group");
        if (trigger && trigger.contains(t)) return;
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

  const togglePlay = () => controllerRef.current?.togglePlay();
  const toggleMute = () => {
    // Spotify Embed API doesn't expose volume; mute the iframe element itself.
    const iframe = iframeRef.current;
    if (!iframe) return;
    const next = !muted;
    // @ts-expect-error non-standard but supported by Chromium/WebKit
    iframe.muted = next;
    setMuted(next);
  };

  return (
    <div className="relative">
      <div
        id="dj-widget-trigger-group"
        className="inline-flex h-9 items-center gap-0.5 overflow-hidden rounded-full border border-border bg-transparent"
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="dj-widget-panel"
          aria-label={open ? "Close DJ player" : "Open DJ player"}
          data-cursor-action="dj-toggle"
          className="inline-flex h-full items-center gap-2 px-3 text-xs font-semibold leading-none text-foreground transition-colors hover:text-primary"
        >
          <Disc3
            className={`size-4 ${isPlaying ? "animate-spin" : ""}`}
            style={isPlaying ? { animationDuration: "3s" } : undefined}
            aria-hidden="true"
          />
          <span className="hidden sm:inline">DJ</span>
        </button>
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          className="inline-flex h-full w-8 items-center justify-center border-l border-border text-foreground transition-colors hover:text-primary"
        >
          {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
        </button>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute music" : "Mute music"}
          aria-pressed={muted}
          className="inline-flex h-full w-8 items-center justify-center border-l border-border text-foreground transition-colors hover:text-primary"
        >
          {muted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
        </button>
      </div>

      {/* Panel — visibility toggled without unmounting so playback persists */}
      <div
        ref={panelRef}
        id="dj-widget-panel"
        role="dialog"
        aria-label="DJ player"
        aria-hidden={!open}
        className={`absolute right-0 top-full z-50 mt-3 w-[340px] origin-top-right overflow-hidden rounded-[20px] border border-foreground/15 bg-card shadow-[0_20px_50px_-20px_hsl(var(--foreground)/0.35)] transition-all duration-200 ${
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border/70 px-4 py-2.5">
          <div className="flex items-center gap-2 text-foreground">
            <Disc3
              className={`size-4 ${isPlaying ? "animate-spin" : ""}`}
              style={isPlaying ? { animationDuration: "3s" } : undefined}
              aria-hidden="true"
            />
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Now spinning
            </span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close DJ player"
            className="inline-flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        </div>
        {/* Persistent embed host — kept mounted regardless of `open`. */}
        <div ref={embedHostRef} className="block" />
      </div>
    </div>
  );
}
