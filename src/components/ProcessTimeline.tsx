import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

// Simple step format (for project detail pages)
interface SimpleProcessStep {
  title: string;
  duration?: string;
  description?: string;
}

// Rich step format (for homepage with icons and numbers)
interface RichProcessStep {
  icon: LucideIcon;
  title: string;
  description: string;
  number: string;
}

type ProcessStep = SimpleProcessStep | RichProcessStep;

interface ProcessTimelineProps {
  steps: ProcessStep[];
}

// Type guard to check if step is rich format
function isRichStep(step: ProcessStep): step is RichProcessStep {
  return 'icon' in step && 'number' in step;
}

export const ProcessTimeline = ({ steps }: ProcessTimelineProps) => {
  const hasRichSteps = steps.length > 0 && isRichStep(steps[0]);

  // Rich format with icons and large numbers (homepage)
  if (hasRichSteps) {
    const richSteps = steps as RichProcessStep[];
    
    return (
      <div className="relative">
        {/* Desktop Timeline - Horizontal */}
        <div className="hidden md:block">
          {/* Connecting line */}
          <div className="absolute top-8 left-0 right-0 h-px bg-border" />
          
          <div className="grid grid-cols-4 gap-6">
            {richSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                {/* Large number */}
                <div className="relative z-10 mb-6">
                  <span className="text-5xl lg:text-6xl font-bold font-display text-foreground/10">
                    {step.number}
                  </span>
                  {/* Dot on line */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-foreground border-4 border-background" />
                </div>
                
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <step.icon className="w-6 h-6 text-muted-foreground" />
                </div>
                
                {/* Content */}
                <h4 className="font-semibold text-lg mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Timeline - Vertical */}
        <div className="md:hidden">
          <div className="relative pl-12">
            {/* Vertical line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
            
            {richSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative mb-10 last:mb-0"
              >
                {/* Number and dot */}
                <div className="absolute left-[-36px] flex items-center justify-center w-10 h-10">
                  <div className="w-3 h-3 rounded-full bg-foreground border-2 border-background" />
                </div>
                
                {/* Large number watermark */}
                <span className="absolute -left-2 -top-2 text-4xl font-bold font-display text-foreground/5">
                  {step.number}
                </span>
                
                {/* Content */}
                <div className="flex items-start gap-3 mb-2">
                  <step.icon className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <h4 className="font-semibold text-base">{step.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Simple format (project detail pages) - keep original design
  const simpleSteps = steps as SimpleProcessStep[];
  
  return (
    <div className="relative">
      {/* Desktop Timeline */}
      <div className="hidden md:block">
        <div className="flex justify-between items-start relative">
          {/* Line connecting dots */}
          <div className="absolute top-3 left-0 right-0 h-[2px] bg-border/50" />
          <div className="absolute top-3 left-0 h-[2px] bg-foreground/30" style={{ width: '100%' }} />
          
          {simpleSteps.map((step, index) => (
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
              <h4 className="font-semibold text-foreground text-base mb-1">{step.title}</h4>
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
          
          {simpleSteps.map((step, index) => (
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
              <h4 className="font-semibold text-foreground text-base">{step.title}</h4>
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
