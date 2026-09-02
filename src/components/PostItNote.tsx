import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PostItNoteProps {
  children: ReactNode;
  /** Base rotation in degrees. */
  rotate?: number;
  className?: string;
}

export const PostItNote = ({ children, rotate = -1.6, className }: PostItNoteProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={false}
      animate={{ rotate }}
      whileHover={reduceMotion ? undefined : { rotate: 0, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn(
        "relative w-full max-w-[420px] bg-postit p-5 text-postit-foreground shadow-[8px_8px_0_0_hsl(var(--foreground))] sm:p-6",
        className,
      )}
    >
      <p className="text-[15px] font-medium leading-[1.5] sm:text-[17px]">{children}</p>

      {/* Folded corner */}
      <span
        className="absolute bottom-0 right-0 size-6 bg-postit-fold"
        style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
        aria-hidden="true"
      />
    </motion.div>
  );
};
