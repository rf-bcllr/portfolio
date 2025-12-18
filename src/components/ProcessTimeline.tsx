import { motion } from "framer-motion";

interface ProcessStep {
  title: string;
  duration?: string;
  description?: string;
}

interface ProcessTimelineProps {
  steps: ProcessStep[];
}

export const ProcessTimeline = ({ steps }: ProcessTimelineProps) => {
  return (
    <div className="relative">
      {/* Desktop Timeline */}
      <div className="hidden md:block">
        <div className="flex justify-between items-start relative">
          {/* Line connecting dots */}
          <div className="absolute top-3 left-0 right-0 h-[2px] bg-border/50" />
          <div className="absolute top-3 left-0 h-[2px] bg-foreground/30" style={{ width: '100%' }} />
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center relative z-10 flex-1"
            >
              {/* Dot */}
              <div className="w-6 h-6 rounded-full bg-foreground border-4 border-background mb-4" />
              
              {/* Content */}
              <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
              {step.duration && (
                <span className="text-xs text-muted-foreground font-medium">{step.duration}</span>
              )}
              {step.description && (
                <p className="text-sm text-muted-foreground mt-2 max-w-[150px]">
                  {step.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Timeline (Vertical) */}
      <div className="md:hidden">
        <div className="relative pl-8">
          {/* Vertical line */}
          <div className="absolute left-3 top-0 bottom-0 w-[2px] bg-foreground/30" />
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative mb-6 last:mb-0"
            >
              {/* Dot */}
              <div className="absolute left-[-20px] w-4 h-4 rounded-full bg-foreground border-2 border-background" />
              
              {/* Content */}
              <h4 className="font-semibold text-foreground">{step.title}</h4>
              {step.duration && (
                <span className="text-xs text-muted-foreground font-medium">{step.duration}</span>
              )}
              {step.description && (
                <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
