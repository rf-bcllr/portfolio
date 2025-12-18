import { motion } from "framer-motion";

interface DecorativeScribblesProps {
  className?: string;
  variant?: "circle" | "lines" | "dots";
  size?: "sm" | "md" | "lg";
}

export const DecorativeScribbles = ({ 
  className = "", 
  variant = "circle",
  size = "md" 
}: DecorativeScribblesProps) => {
  const sizeMap = {
    sm: { width: 80, height: 80 },
    md: { width: 120, height: 120 },
    lg: { width: 180, height: 180 }
  };
  
  const dimensions = sizeMap[size];

  if (variant === "circle") {
    return (
      <motion.svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 120 120"
        fill="none"
        className={`pointer-events-none ${className}`}
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Hand-drawn circle effect */}
        <motion.path
          d="M60 10 C90 10, 110 30, 110 60 C110 90, 90 110, 60 110 C30 110, 10 90, 10 60 C10 30, 30 10, 60 10"
          stroke="hsl(var(--primary))"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="4 6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        />
        {/* Second offset circle for hand-drawn effect */}
        <motion.path
          d="M58 12 C88 14, 108 32, 106 62 C104 92, 88 108, 58 106 C28 104, 12 88, 14 58 C16 28, 28 12, 58 12"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity={0.4}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" }}
        />
      </motion.svg>
    );
  }

  if (variant === "lines") {
    return (
      <motion.svg
        width={dimensions.width}
        height={dimensions.height / 2}
        viewBox="0 0 120 60"
        fill="none"
        className={`pointer-events-none ${className}`}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Hand-drawn underline */}
        <motion.path
          d="M5 30 Q30 25, 60 30 T115 28"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        />
        <motion.path
          d="M10 38 Q40 42, 70 36 T110 40"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity={0.5}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
        />
      </motion.svg>
    );
  }

  // dots variant
  return (
    <motion.svg
      width={dimensions.width}
      height={dimensions.height}
      viewBox="0 0 120 120"
      fill="none"
      className={`pointer-events-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {[...Array(5)].map((_, i) => (
        <motion.circle
          key={i}
          cx={20 + i * 22}
          cy={60 + (i % 2 === 0 ? -8 : 8)}
          r={4}
          fill="hsl(var(--primary))"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ delay: 0.1 * i, duration: 0.4 }}
        />
      ))}
    </motion.svg>
  );
};

export const DecorativeArrow = ({ className = "" }: { className?: string }) => (
  <motion.svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    className={`pointer-events-none ${className}`}
    initial={{ opacity: 0, rotate: -20 }}
    animate={{ opacity: 1, rotate: 0 }}
    transition={{ duration: 0.6, delay: 0.8 }}
  >
    <motion.path
      d="M8 32 Q20 20, 32 8"
      stroke="hsl(var(--primary))"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.6, delay: 0.9 }}
    />
    <motion.path
      d="M24 8 L32 8 L32 16"
      stroke="hsl(var(--primary))"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.4, delay: 1.3 }}
    />
  </motion.svg>
);

export const DecorativeStar = ({ className = "" }: { className?: string }) => (
  <motion.svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    className={`pointer-events-none ${className}`}
    initial={{ opacity: 0, scale: 0, rotate: -45 }}
    animate={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
  >
    <path
      d="M16 2 L18 14 L30 16 L18 18 L16 30 L14 18 L2 16 L14 14 Z"
      fill="hsl(var(--primary))"
      opacity={0.8}
    />
  </motion.svg>
);
