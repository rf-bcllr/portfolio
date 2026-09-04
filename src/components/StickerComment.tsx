import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import avatarImg from "@/assets/rafael-bacellar-avatar.jpg";

type PinCorner = "tl" | "tr" | "bl" | "br";

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
  /** which corner of the sticker the comment pin sits on */
  pin?: PinCorner;
  author?: string;
  className?: string;
}

const PIN_SIZE = 40;
const OPEN_WIDTH = 236;

export const StickerComment = ({
  src,
  alt,
  comment,
  link,
  size = 140,
  rotate = -4,
  pin = "tr",
  author = "Rafael Bacellar",
  className = "",
}: StickerCommentProps) => {
  const [open, setOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (contentRef.current) setContentHeight(contentRef.current.scrollHeight);
  }, [comment, link]);

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
    : { type: "spring" as const, stiffness: 320, damping: 26, mass: 0.7 };

  const sticker = (
    <motion.img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      initial={false}
      animate={{ rotate: open ? 0 : rotate, scale: 1 }}
      whileHover={reduceMotion ? undefined : { scale: 1.07, rotate: 0, y: -6 }}
      transition={spring}
      className="pointer-events-none select-none object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.18)]"
      style={{ width: size, height: size }}
    />
  );

  if (!comment) {
    return (
      <div className={`relative ${className}`} data-no-draw="true">
        {sticker}
      </div>
    );
  }

  const isTop = pin === "tl" || pin === "tr";
  const isLeft = pin === "tl" || pin === "bl";

  // pin sits slightly outside the sticker corner
  const cornerStyle: React.CSSProperties = {
    [isTop ? "top" : "bottom"]: -10,
    [isLeft ? "left" : "right"]: -10,
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative ${className}`}
      data-no-draw="true"
      style={{ width: size, height: size }}
    >
      <div className="cursor-pointer" onClick={() => setOpen((v) => !v)} aria-hidden="true">
        {sticker}
      </div>

      <motion.div
        layout={false}
        className="absolute z-30"
        style={{ ...cornerStyle, transformOrigin: `${isTop ? "top" : "bottom"} ${isLeft ? "left" : "right"}` }}
      >
        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Hide comment" : `${alt} — show comment`}
          data-cursor-action="open-comment"
          initial={false}
          animate={{
            width: open ? OPEN_WIDTH : PIN_SIZE,
            height: open ? Math.max(PIN_SIZE, contentHeight + 6) : PIN_SIZE,
          }}
          transition={spring}
          className={`relative flex cursor-pointer items-start overflow-hidden bg-white text-left shadow-[0_8px_24px_rgba(0,0,0,0.22)] ring-1 ring-black/10 dark:bg-neutral-900 dark:ring-white/15 ${
            isTop && isLeft
              ? "rounded-[20px] rounded-tl-md"
              : isTop
                ? "rounded-[20px] rounded-tr-md"
                : isLeft
                  ? "rounded-[20px] rounded-bl-md"
                  : "rounded-[20px] rounded-br-md"
          }`}
        >
          <span className="absolute left-0 top-0 flex size-10 shrink-0 items-center justify-center">
            <img
              src={avatarImg}
              alt={author}
              className="size-7 rounded-full object-cover"
              loading="lazy"
            />
          </span>

          {!open && (
            <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full bg-primary ring-2 ring-white dark:ring-neutral-900" />
          )}

          <motion.div
                ref={contentRef}
                initial={false}
                animate={{ opacity: open ? 1 : 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.18, delay: open && !reduceMotion ? 0.08 : 0 }}
                className="shrink-0 pl-10 pr-3 pt-2.5"
                style={{ width: OPEN_WIDTH }}
              >
                <p className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                  {author}
                </p>
                <p className="mt-1 text-[13px] font-medium leading-[1.45] text-neutral-900 dark:text-neutral-100">
                  {comment}
                </p>
                {link && (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    data-cursor-action="navigate-external"
                    className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-primary underline underline-offset-2"
                  >
                    {link.label}
                    <ArrowUpRight className="size-3.5" />
                  </a>
                )}
                <span className="block h-3" />
              </motion.div>
        </motion.button>
      </motion.div>
    </div>
  );
};
