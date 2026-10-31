import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2.5 text-xs font-semibold whitespace-nowrap transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3.5!',
  {
    variants: {
      variant: {
        // Soft green: "Now", "Steady"
        default: 'bg-primary-tint text-primary',
        // Neutral grey-green
        secondary: 'bg-secondary text-secondary-foreground',
        // Green with a tick: "Done", "Paid", "Setup complete"
        success: 'bg-success-surface text-success',
        // Purple, AI only: "AI suggested", "Recommended"
        ai: 'border-ai-border bg-ai-surface text-ai-ink',
        // Gold, Pro only: "Pro", "Current plan"
        pro: 'border-pro-border bg-surface-cream text-gold-ink',
        // Warm cream, for breaks: "Next break in 18 min"
        cream: 'bg-surface-cream text-gold-ink',
        // Yellow: "Coming soon"
        warning: 'bg-warning-surface text-warning-ink',
        // Soft red, only for real problems: "Payment failed"
        destructive: 'bg-destructive-surface text-destructive',
        outline: 'border-border text-foreground',
        ghost: 'text-muted-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span';

  return <Comp data-slot="badge" data-variant={variant} className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
