import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSessionCursorColor } from "@/lib/cursorColor";
import { cn } from "@/lib/utils";
import avatarImg from "@/assets/rafael-bacellar-avatar.jpg";

export interface FigmaCommentProps {
  /** Comment body shown when the pin is expanded. */
  comment: string;
  /** Author name, used for a11y and the initial fallback. */
  author?: string;
  /** Expanded bubble width in px. */
  width?: number;
  /** Shows the unread indicator until the comment is opened once. */
  notification?: boolean;
  className?: string;
}

export const FigmaComment = ({
  comment,
  author = "Rafael Bacellar",
  width = 240,
  notification = true,
  className,
}: FigmaCommentProps) => {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const color = useMemo(() => getSessionCursorColor(), []);

  useLayoutEffect(() => {
    if (!contentRef.current) return;
    const measure = () => setContentHeight(contentRef.current?.scrollHeight ?? 0);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, [comment, width]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const spring = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 320, damping: 26, mass: 0.7 };

  return (
    <div ref={rootRef} className={cn("relative z-30", className)} data-no-draw>
      <motion.button
        type="button"
        aria-expanded={open}
        aria-label={open ? `Hide comment by ${author}` : `Show comment by ${author}`}
        onClick={() => {
          setOpen((v) => !v);
          setSeen(true);
        }}
        animate={{
          width: open ? width : 40,
          height: open ? 40 + contentHeight : 40,
        }}
        transition={spring}
        style={{ borderColor: color }}
        className="flex items-start overflow-hidden rounded-full rounded-bl-none border-2 border-foreground bg-background text-left shadow-[3px_3px_0_0_hsl(var(--foreground))] transition-shadow hover:shadow-[5px_5px_0_0_hsl(var(--foreground))]"
      >
        <span className="relative flex size-10 shrink-0 items-center justify-center">
          <Avatar className="size-7 border-2" style={{ borderColor: color }}>
            <AvatarImage src={avatarImg} alt={author} />
            <AvatarFallback className="text-[10px] font-bold">
              {author.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {notification && !seen && (
            <span
              className="absolute right-0.5 top-0.5 size-2.5 rounded-full border border-foreground"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
          )}
        </span>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="body"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
              className="min-w-0 py-2 pr-4"
              style={{ width: width - 40 }}
            >
              <div>
                <p
                  className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {author}
                </p>
                <p className="mt-1 text-[13px] font-medium leading-snug text-foreground">
                  {comment}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Hidden measurer so height is known before first open */}
      <div className="pointer-events-none invisible absolute -z-10" aria-hidden="true">
        <div ref={contentRef} style={{ width: width - 40 }} className="pr-4">
          <p
            className="text-[9px] font-bold uppercase tracking-[0.18em]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {author}
          </p>
          <p className="mt-1 text-[13px] font-medium leading-snug">{comment}</p>
        </div>
      </div>
    </div>
  );
};
