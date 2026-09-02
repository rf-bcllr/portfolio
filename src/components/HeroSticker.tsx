import { motion, useReducedMotion } from "framer-motion";
import { FigmaComment } from "@/components/FigmaComment";
import { cn } from "@/lib/utils";

interface HeroStickerProps {
  src: string;
  alt: string;
  comment?: string;
  /** Base rotation in degrees. */
  rotate?: number;
  /** Where the comment pin sits relative to the sticker. */
  pinPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  commentWidth?: number;
  className?: string;
  imageClassName?: string;
}

const pinClasses: Record<NonNullable<HeroStickerProps["pinPosition"]>, string> = {
  "top-left": "-left-2 -top-3",
  "top-right": "-right-2 -top-3",
  "bottom-left": "-bottom-3 -left-2",
  "bottom-right": "-bottom-3 -right-2",
};

export const HeroSticker = ({
  src,
  alt,
  comment,
  rotate = 0,
  pinPosition = "top-right",
  commentWidth = 240,
  className,
  imageClassName,
}: HeroStickerProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn("relative", className)} data-no-draw>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        initial={false}
        animate={{ rotate }}
        whileHover={reduceMotion ? undefined : { rotate: 0, scale: 1.08 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "pointer-events-auto size-full select-none object-contain drop-shadow-[3px_4px_0_hsl(var(--foreground)/0.18)]",
          imageClassName,
        )}
      />

      {comment && (
        <div className={cn("absolute", pinClasses[pinPosition])}>
          <FigmaComment comment={comment} width={commentWidth} />
        </div>
      )}
    </div>
  );
};
