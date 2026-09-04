import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import avatarImg from "@/assets/rafael-bacellar-avatar.jpg";

interface FigmaCommentProps {
  /** Comment body revealed when the pin is opened. */
  comment: string;
  /** Author name, used for the avatar alt text and initial fallback. */
  author?: string;
  /** Max width of the expanded bubble, in px. */
  width?: number;
  /** Shows a small unread dot until the comment is opened for the first time. */
  notification?: boolean;
  /** Anchor direction for the expanded bubble. */
  align?: "left" | "right";
  className?: string;
}

const PIN_SIZE = 44;

export const FigmaComment = ({
  comment,
  author = "Rafael Bacellar",
  width = 240,
  notification = true,
  align = "left",
  className = "",
}: FigmaCommentProps) => {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [comment, width]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggle = () => {
    setOpen((prev) => !prev);
    setSeen(true);
  };

  const transition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 320, damping: 26, mass: 0.7 };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <motion.div
        animate={{
          width: open ? width : PIN_SIZE,
          height: open ? PIN_SIZE + contentHeight + 12 : PIN_SIZE,
        }}
        transition={transition}
        className={`overflow-hidden border-2 border-foreground bg-card text-card-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] ${
          open ? "rounded-2xl rounded-bl-none" : "rounded-full"
        }`}
        style={align === "right" ? { marginLeft: "auto" } : undefined}
      >
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-label={open ? "Hide comment" : `Show comment from ${author}`}
          data-cursor-action="open-comment"
          className="flex h-11 w-full items-center gap-2 px-[3px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className="relative size-[38px] shrink-0 overflow-hidden rounded-full border-2 border-foreground bg-muted">
            <img
              src={avatarImg}
              alt={author}
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
            <span className="pointer-events-none absolute inset-0 hidden items-center justify-center font-display text-sm font-bold">
              {author.charAt(0)}
            </span>
          </span>
          {open && (
            <span
              className="truncate pr-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {author.split(" ")[0]}
            </span>
          )}
          {notification && !seen && !open && (
            <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-foreground bg-primary" />
          )}
        </button>

        <motion.p
          ref={contentRef}
          animate={{
            opacity: open ? 1 : 0,
            filter: reduceMotion ? "none" : open ? "blur(0px)" : "blur(4px)",
          }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.25 }}
          style={{ width: width - 4 }}
          className="px-3 pb-3 text-[13px] font-medium leading-[1.45] text-foreground"
        >
          {comment}
        </motion.p>
      </motion.div>
    </div>
  );
};
