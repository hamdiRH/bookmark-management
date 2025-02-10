import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define badge variants for styling
const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80', // Default style
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80', // Secondary style
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80', // Destructive style
        outline:
          'border-2 border-foreground text-foreground hover:bg-foreground/10', // Outline style
      },
    },
    defaultVariants: {
      variant: 'default', // Default variant
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(badgeVariants({ variant }), className)}
    {...props}
  />
));

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
