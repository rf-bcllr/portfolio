import React from "react";
import { cn } from "@/lib/utils";

interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {}

export function BentoGrid({ className, ...props }: BentoGridProps) {
  return (
    <div
      className={cn(
        "container mx-auto grid auto-rows-[minmax(180px,auto)] gap-4 px-6 py-12 sm:grid-cols-6 lg:grid-cols-8",
        className
      )}
      {...props}
    />
  );
}

interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function BentoCard({ className, children, ...props }: BentoCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-400 animate-enter",
        "hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.01]",
        "focus-within:ring-2 focus-within:ring-primary",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

