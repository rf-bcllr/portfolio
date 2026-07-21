import { useEffect, useMemo, useRef, useState } from "react";
import { Disc3, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import { getSessionCursorColor } from "@/lib/cursorColor";

const PLAYLIST_ID = "3wIcvT1o526tAiSwZ9q7aH";
const PLAYLIST_URI = `spotify:playlist:${PLAYLIST_ID}`;

type SpotifyController = {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  resume: () => void;
  destroy: () => void;
  setVolume?: (volume: number) => void;
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

// Perceived-luminance helper — decides black vs. white foreground on the tint.
function readableFg(hex: string) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? "#0a0a0a" : "#ffffff";
}

export function DJWidget() {
  const [open, setOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(60); // 0–100
  const panelRef = useRef<HTMLDivElement | null>(null);
  const embedHostRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<SpotifyController | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Same random palette color as the visitor's cursor.
  const cursorColor = useMemo(() => getSessionCursorColor(), []);
  const fg = useMemo(() => readableFg(cursorColor), [cursorColor]);

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
          iframeRef.current = host.querySelector("iframe");
          if (iframeRef.current) {
            iframeRef.current.setAttribute("title", "Spotify DJ playlist");
            iframeRef.current.setAttribute("loading", "lazy");
            iframeRef.current.allow =
              "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
          }
          controller.setVolume?.(volume / 100);
        }
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push volume changes down to the Spotify controller (if supported).
  useEffect(() => {
    controllerRef.current?.setVolume?.(muted ? 0 : volume / 100);
  }, [volume, muted]);

  // Close panel on outside click / Escape (does NOT stop playback).
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current && !panelRef.current.contains(t)) {
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
    const next = !muted;
    // Fallback for browsers where setVolume isn't honored: mute the iframe too.
    const iframe = iframeRef.current;
    if (iframe) {
      // @ts-expect-error non-standard but supported by Chromium/WebKit
      iframe.muted = next;
    }
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
        {/* Inline volume slider — no need to open the panel */}
        <label className="hidden h-full items-center gap-1.5 border-l border-border pl-2 pr-2.5 sm:inline-flex">
          <span className="sr-only">Volume</span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={muted ? 0 : volume}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (muted && v > 0) setMuted(false);
              setVolume(v);
            }}
            aria-label="Music volume"
            className="dj-volume h-1.5 w-16 cursor-pointer appearance-none rounded-full bg-border accent-foreground"
            style={{
              backgroundImage: `linear-gradient(to right, hsl(var(--foreground)) 0%, hsl(var(--foreground)) ${
                muted ? 0 : volume
              }%, hsl(var(--border)) ${muted ? 0 : volume}%, hsl(var(--border)) 100%)`,
            }}
          />
        </label>
      </div>

      {/* Panel — visibility toggled without unmounting so playback persists */}
      <div
        ref={panelRef}
        id="dj-widget-panel"
        role="dialog"
        aria-label="DJ player"
        aria-hidden={!open}
        style={{
          backgroundColor: cursorColor,
          color: fg,
          borderColor: fg === "#0a0a0a" ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.2)",
          boxShadow: `0 20px 50px -20px ${cursorColor}80`,
        }}
        className={`absolute right-0 top-full z-50 mt-3 w-[340px] origin-top-right overflow-hidden rounded-[20px] border transition-all duration-200 ${
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{
            borderBottom: `1px solid ${
              fg === "#0a0a0a" ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.18)"
            }`,
          }}
        >
          <div className="flex items-center gap-2">
            <Disc3
              className={`size-4 ${isPlaying ? "animate-spin" : ""}`}
              style={isPlaying ? { animationDuration: "3s" } : undefined}
              aria-hidden="true"
            />
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.22em] opacity-80"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Now spinning
            </span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close DJ player"
            className="inline-flex size-6 items-center justify-center rounded-full opacity-80 transition hover:opacity-100"
            style={{ color: fg }}
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
