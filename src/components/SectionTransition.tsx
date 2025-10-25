import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionTransitionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  type?: "fade" | "scale" | "slide";
}

export const SectionTransition = ({ 
  children, 
  className = "", 
  delay = 0,
  type = "fade" 
}: SectionTransitionProps) => {
  const variants = {
    fade: {
      hidden: { opacity: 0, y: 40 },
      show: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.8,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94] as const,
        }
      },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.95 },
      show: { 
        opacity: 1, 
        scale: 1,
        transition: {
          duration: 0.7,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94] as const,
        }
      },
    },
    slide: {
      hidden: { opacity: 0, x: -60 },
      show: { 
        opacity: 1, 
        x: 0,
        transition: {
          duration: 0.8,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94] as const,
        }
      },
    },
  };

  return (
    <motion.div
      variants={variants[type]}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-120px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
