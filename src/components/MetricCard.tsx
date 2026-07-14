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
      className="text-center py-4"
    >
      <div className="text-5xl lg:text-6xl font-normal text-foreground mb-2 font-display">
        {value}
      </div>
      <div className="text-sm text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  );
};
