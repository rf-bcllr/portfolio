import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  // Editorial spec — square, hairline, uppercase Clash Display micro-labels
  "inline-flex items-center rounded-none border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] [font-family:var(--font-display)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-foreground bg-foreground text-background hover:bg-foreground/90",
        secondary:
          "border-foreground bg-card text-foreground hover:bg-foreground hover:text-background",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-foreground text-foreground hover:bg-foreground hover:text-background",
        muted:
          "border-foreground/40 bg-transparent text-muted-foreground hover:border-foreground hover:text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
