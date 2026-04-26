import { useState, type CSSProperties } from "react";

export interface VideoSource {
  src: string;
  type: string; // e.g. "video/webm" | "video/mp4"
}

interface MediaThumbProps {
  /**
   * For images: a single src string.
   * For videos: pass `sources` instead.
   */
  src?: string;
  sources?: VideoSource[];
  /** Poster used when rendering a video thumbnail. */
  poster?: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  /** When true, image is loaded eagerly (use for above-the-fold media). */
  priority?: boolean;
  /** Show a pulsing skeleton until media decodes. Defaults to true. */
  showSkeleton?: boolean;
  width?: number;
  height?: number;
  onLoaded?: () => void;
}

const VIDEO_EXT_RE = /\.(mp4|webm|ogg|mov)(?:\?|$)/i;

/**
 * Unified thumbnail renderer that picks <video> for animated sources
 * (mp4/webm) and <img> otherwise. Defaults to lazy + async decoding so
 * thumbnails outside the viewport never block the main thread.
 */
export function MediaThumb({
  src,
  sources,
  poster,
  alt,
  className,
  style,
  priority = false,
  showSkeleton = true,
  width,
  height,
  onLoaded,
}: MediaThumbProps) {
  const [loaded, setLoaded] = useState(false);

  const isVideo = sources && sources.length > 0
    ? true
    : src
    ? VIDEO_EXT_RE.test(src)
    : false;

  const handleLoaded = () => {
    setLoaded(true);
    onLoaded?.();
  };

  return (
    <div className="relative w-full h-full">
      {showSkeleton && !loaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" aria-hidden />
      )}

      {isVideo ? (
        <video
          className={className}
          style={style}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload={priority ? "auto" : "metadata"}
          width={width}
          height={height}
          aria-label={alt}
          onLoadedData={handleLoaded}
          onCanPlay={handleLoaded}
        >
          {sources
            ? sources.map((s) => <source key={s.src} src={s.src} type={s.type} />)
            : src && <source src={src} />}
        </video>
      ) : (
        <img
          src={src}
          alt={alt}
          className={className}
          style={style}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          {...(priority ? { fetchPriority: "high" as const } : {})}
          onLoad={handleLoaded}
        />
      )}
    </div>
  );
}

export default MediaThumb;
