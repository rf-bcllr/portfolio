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
    return;
  }
  return;
};