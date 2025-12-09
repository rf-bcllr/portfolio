import { motion } from "framer-motion";
import { Quote } from "lucide-react";
interface QuoteBlockProps {
  quote: string;
  author?: string;
  role?: string;
  variant?: "highlight" | "testimonial";
}
export const QuoteBlock = ({
  quote,
  author,
  role,
  variant = "testimonial"
}: QuoteBlockProps) => {
  if (variant === "highlight") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="relative pl-6 py-4 mb-6 border-l-4 border-primary bg-primary/5 rounded-r-lg"
      >
        <p className="text-xl lg:text-2xl font-medium text-foreground italic leading-relaxed">
          "{quote}"
        </p>
      </motion.div>
    );
  }
  return (
    <motion.blockquote
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative pl-8 py-6 border-l-2 border-muted"
    >
      <Quote className="absolute left-0 top-6 w-5 h-5 text-primary -translate-x-1/2 bg-background" />
      <p className="text-lg text-muted-foreground italic leading-relaxed mb-4">
        "{quote}"
      </p>
      {author && (
        <footer className="text-sm">
          <span className="font-semibold text-foreground">{author}</span>
          {role && <span className="text-muted-foreground"> — {role}</span>}
        </footer>
      )}
    </motion.blockquote>
  );
};