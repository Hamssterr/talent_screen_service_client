import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-colors gap-1 [&>svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline:
          "border-border text-foreground bg-transparent",
        success:
          "border-success/20 bg-success-soft text-success-foreground",
        warning:
          "border-warning/20 bg-warning-soft text-warning-foreground",
        danger:
          "border-danger/20 bg-danger-soft text-danger-foreground",
        info:
          "border-info/20 bg-info-soft text-info-foreground",
        peach:
          "border-peach-border bg-peach-soft text-peach-foreground",
        ai:
          "border-ai-border bg-ai-soft text-ai-foreground",
        muted:
          "border-transparent bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
