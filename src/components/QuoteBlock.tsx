import { motion } from "framer-motion";

interface QuoteBlockProps {
  quote: string;
  author?: string;
  role?: string;
  variant?: "highlight" | "testimonial"; // kept for backwards compatibility, both render same style
}

export const QuoteBlock = ({
  quote,
  author,
  role,
}: QuoteBlockProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative pl-6 py-4 mb-6 border-l-4 border-border bg-muted/50 rounded-r-xl"
    >
      <p className="text-xl md:text-2xl font-medium text-foreground italic leading-relaxed">
        "{quote}"
      </p>
      {author && (
        <footer className="mt-4 text-sm">
          <span className="font-semibold text-foreground">{author}</span>
          {role && <span className="text-muted-foreground"> — {role}</span>}
        </footer>
      )}
    </motion.div>
  );
};
