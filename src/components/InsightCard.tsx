import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface InsightCardProps {
  insight: string;
  delay?: number;
}

export const InsightCard = ({ insight, delay = 0 }: InsightCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      viewport={{ once: true }}
      className="bg-muted/50 border border-border rounded-xl p-4 flex items-start gap-3"
    >
      <Lightbulb className="w-5 h-5 text-foreground flex-shrink-0 mt-0.5" />
      <p className="text-sm text-foreground">{insight}</p>
    </motion.div>
  );
};
