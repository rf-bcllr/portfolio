import { motion } from "framer-motion";

interface MetricCardProps {
  value: string;
  label: string;
  delay?: number;
}

export const MetricCard = ({ value, label, delay = 0 }: MetricCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 text-center hover:border-primary/30 transition-all duration-300"
    >
      <div className="text-4xl lg:text-5xl font-bold text-primary mb-2 font-display">
        {value}
      </div>
      <div className="text-sm text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  );
};
