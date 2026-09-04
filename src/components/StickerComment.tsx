import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const CLOSED_SIZE = 32;
const AVATAR_CLOSED_LEFT = 4;
const AVATAR_CLOSED_TOP = 4;
const AVATAR_OPEN_LEFT = 12;
const AVATAR_OPEN_TOP = 12;
const CONTENT_DELAY = 0.15;
const CONTAINER_CLOSE_DELAY = 0.08;
const BLUR_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

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
  const [contentHeight, setContentHeight] = useState(CLOSED_SIZE);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const measureHeight = () => {
      const inner = contentRef.current?.firstElementChild as HTMLElement | null;
      if (inner?.scrollHeight) setContentHeight(inner.scrollHeight);
    };
    const shortTimer = window.setTimeout(measureHeight, 100);
    const longTimer = window.setTimeout(measureHeight, 500);
    return () => {
      window.clearTimeout(shortTimer);
      window.clearTimeout(longTimer);
    };
  }, [comment, link]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: globalThis.KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggle = () => setOpen((value) => !value);
  const onKeyActivate = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  };

  const sticker = (
    <motion.img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      initial={false}
      animate={{ rotate: open ? 0 : rotate, scale: 1 }}
      whileHover={reduceMotion ? undefined : { scale: 1.07, rotate: 0, y: -6 }}
      transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 22 }}
      className="pointer-events-none select-none object-contain drop-shadow-[0_12px_18px_hsl(var(--foreground)/0.16)]"
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

  // pin is always anchored to the top-right of the sticker, slightly overlapping it.
  // "left"-ish pins belong to stickers on the left side of the canvas, so the bubble grows to the right.
  const growRight = pin === "tl" || pin === "bl";
  const pinStyle: React.CSSProperties = { top: 6, right: 6 };
  const openWidth = link ? 224 : 200;


  return (
    <div
      ref={wrapperRef}
      className={`relative ${className}`}
      data-no-draw="true"
      style={{ width: size, height: size }}
    >
      <div
        className="cursor-pointer"
        onClick={toggle}
        aria-hidden="true"
        data-cursor-action="open-comment"
      >
        {sticker}
      </div>

      <div
        className="absolute z-30"
        style={pinStyle}
      >
        <motion.div
          animate={
            reduceMotion
              ? {}
              : { height: open ? contentHeight : CLOSED_SIZE, width: open ? openWidth : CLOSED_SIZE }
          }
          className={`absolute bottom-0 cursor-pointer overflow-hidden rounded-2xl bg-background shadow-[0px_0px_0.5px_0px_rgba(0,0,0,0.18),0px_3px_8px_0px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)] ${growRight ? "left-0 rounded-bl-none" : "right-0 rounded-br-none"}`}
          onClick={(event) => {
            event.stopPropagation();
            toggle();
          }}
          onKeyDown={onKeyActivate}
          role="button"
          tabIndex={0}
          aria-expanded={open}
          aria-label={open ? "Hide comment" : `Show comment about ${alt}`}
          data-cursor-action="open-comment"
          style={reduceMotion ? { height: open ? contentHeight : CLOSED_SIZE, width: open ? openWidth : CLOSED_SIZE } : undefined}
          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 550, damping: 45, mass: 0.7, duration: 0.25, delay: open ? 0 : CONTAINER_CLOSE_DELAY }}
        >
          <motion.div
            animate={reduceMotion ? {} : { left: open ? AVATAR_OPEN_LEFT : AVATAR_CLOSED_LEFT, top: open ? AVATAR_OPEN_TOP : AVATAR_CLOSED_TOP }}
            className="absolute z-10"
            style={reduceMotion ? { left: open ? AVATAR_OPEN_LEFT : AVATAR_CLOSED_LEFT, top: open ? AVATAR_OPEN_TOP : AVATAR_CLOSED_TOP } : undefined}
            transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 25, duration: 0.25 }}
          >
            <Avatar className="h-6 w-6">
              <AvatarImage alt={author} src={avatarImg} />
              <AvatarFallback>{author.charAt(0)}</AvatarFallback>
            </Avatar>
          </motion.div>

          <div ref={contentRef} className="pointer-events-none absolute" style={{ left: 0, top: -9999, width: openWidth }}>
            <div className="flex flex-col items-start gap-0.5 py-3 pl-11 pr-4">
              <div className="flex items-start gap-0.5">
                <p className="text-[11px] font-semibold leading-4 text-foreground">{author}</p>
                <p className="text-[11px] font-medium leading-4 text-muted-foreground">Just now</p>
              </div>
              <p className="text-left text-[11px] font-medium leading-4 text-foreground">{comment}</p>
              {link && <span className="h-5" />}
            </div>
          </div>

          <AnimatePresence>
            {open ? (
              <motion.div
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(6px)" }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, filter: "blur(0px)" }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(3px)" }}
                transition={reduceMotion ? { duration: 0 } : { opacity: { delay: CONTENT_DELAY, duration: 0.25, ease: BLUR_EASE }, filter: { delay: CONTENT_DELAY, duration: 0.25, ease: BLUR_EASE } }}
                className="absolute inset-0 flex flex-col items-start gap-0.5 py-3 pl-11 pr-4"
                style={{ width: openWidth }}
              >
                <div className="flex items-start gap-0.5">
                  <p className="text-[11px] font-semibold leading-4 text-foreground">{author}</p>
                  <p className="text-[11px] font-medium leading-4 text-muted-foreground">Just now</p>
                </div>
                <p className="text-left text-[11px] font-medium leading-4 text-foreground">{comment}</p>
                {link && (
                  <a href={link.href} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} className="pointer-events-auto mt-1 inline-flex items-center gap-1 text-[11px] font-semibold leading-4 text-primary underline underline-offset-2" data-cursor-action="navigate-external">
                    {link.label}<ArrowUpRight className="size-3" />
                  </a>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
