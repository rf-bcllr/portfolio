import React from "react";
import { cn } from "@/lib/utils";

interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {}

export function BentoGrid({ className, ...props }: BentoGridProps) {
  return (
    <div
className={cn(
        "w-full grid grid-flow-col auto-cols-[minmax(240px,1fr)] grid-rows-[220px_220px] gap-4 overflow-x-auto px-4 py-8 sm:auto-cols-[minmax(280px,1fr)] sm:grid-rows-[260px_260px] lg:auto-cols-[minmax(340px,1fr)] lg:grid-rows-[320px_320px] snap-x",
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

