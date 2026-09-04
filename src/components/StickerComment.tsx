import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import avatarImg from "@/assets/rafael-bacellar-avatar.jpg";

interface StickerCommentProps {
  src: string;
  alt: string;
  /** comment text; when omitted the sticker is purely decorative */
  comment?: string;
  /** optional link rendered inside the comment bubble */
  link?: { label: string; href: string };
  /** px size of the sticker */
  size?: number;
  /** resting rotation in degrees */
  rotate?: number;
  /** which side the bubble opens towards */
  side?: "left" | "right";
  author?: string;
  className?: string;
}

export const StickerComment = ({
  src,
  alt,
  comment,
  link,
  size = 120,
  rotate = -4,
  side = "right",
  author = "Rafael Bacellar",
  className = "",
}: StickerCommentProps) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const spring = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 380, damping: 28, mass: 0.7 };

  const sticker = (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className="pointer-events-none select-none object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.16)]"
      style={{ width: size, height: size }}
    />
  );

  if (!comment) {
    return (
      <div className={`relative ${className}`} data-no-draw="true" style={{ transform: `rotate(${rotate}deg)` }}>
        {sticker}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={`relative ${className}`} data-no-draw="true">
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Hide comment" : `${alt} — show comment`}
        data-cursor-action="open-comment"
        initial={false}
        animate={{ rotate: open ? 0 : rotate }}
        whileHover={reduceMotion ? undefined : { scale: 1.08, rotate: 0, y: -4 }}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
        transition={spring}
        className="block cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        {sticker}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -4 }}
            transition={spring}
            style={{ transformOrigin: side === "right" ? "top left" : "top right" }}
            className={`absolute top-[calc(100%-8px)] z-30 w-[220px] rounded-2xl border border-black/10 bg-white p-3 text-left shadow-[0_12px_32px_rgba(0,0,0,0.18)] dark:border-white/15 dark:bg-neutral-900 ${
              side === "right" ? "left-6 rounded-tl-none" : "right-6 rounded-tr-none"
            }`}
          >
            <div className="flex items-center gap-2">
              <img
                src={avatarImg}
                alt={author}
                className="size-6 shrink-0 rounded-full object-cover"
                loading="lazy"
              />
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                {author}
              </span>
            </div>
            <p className="mt-2 text-[13px] font-medium leading-[1.45] text-neutral-900 dark:text-neutral-100">
              {comment}
            </p>
            {link && (
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                data-cursor-action="navigate-external"
                className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-primary underline underline-offset-2"
              >
                {link.label}
                <ArrowUpRight className="size-3.5" />
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
