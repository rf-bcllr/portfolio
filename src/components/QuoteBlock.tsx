import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface QuoteBlockProps {
  quote: string;
  author?: string;
  role?: string;
  variant?: "highlight" | "testimonial";
}

export const QuoteBlock = ({ quote, author, role, variant = "testimonial" }: QuoteBlockProps) => {
  if (variant === "highlight") {
    return (
      <motion.blockquote
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="border-l-4 border-primary pl-6 py-2 my-6"
      >
        <p className="text-xl lg:text-2xl text-foreground font-light italic leading-relaxed">
          "{quote}"
        </p>
      </motion.blockquote>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 relative"
    >
      <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
      <p className="text-foreground text-lg italic mb-4 leading-relaxed">
        "{quote}"
      </p>
      {author && (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
            {author.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-foreground text-sm">{author}</p>
            {role && <p className="text-xs text-muted-foreground">{role}</p>}
          </div>
        </div>
      )}
    </motion.div>
  );
};
