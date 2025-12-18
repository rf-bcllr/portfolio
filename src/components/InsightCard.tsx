import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface InsightCardProps {
  insight: string;
  delay?: number;
}

export const InsightCard = ({ insight, delay = 0 }: InsightCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      viewport={{ once: true }}
      className="flex items-start gap-3"
    >
      <Lightbulb className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
      <p className="text-base text-muted-foreground">{insight}</p>
    </motion.div>
  );
};
