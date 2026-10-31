import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent bg-clip-padding text-[15px] leading-5 font-semibold whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[18px]",
  {
    variants: {
      variant: {
        // Main green button: "Log in", "Continue", "Start focus"
        default: 'bg-primary text-primary-foreground hover:bg-primary-hover',
        // White button with a grey edge: "Customize setup", "Regenerate"
        secondary: 'border-input bg-card text-foreground hover:bg-primary-tint aria-expanded:bg-primary-tint',
        // Same look as secondary (shadcn's own components use this name)
        outline: 'border-input bg-card text-foreground hover:bg-primary-tint aria-expanded:bg-primary-tint',
        // No background until you hover: "Back", "Skip for now"
        ghost: 'text-foreground hover:bg-primary-tint aria-expanded:bg-primary-tint',
        // Purple, ONLY for AI actions: "Review plan", "Open AI planner"
        ai: 'bg-ai text-ai-foreground hover:bg-ai-hover',
        // Gold, ONLY for Pro actions: "Upgrade to Pro"
        pro: 'bg-gold text-gold-foreground hover:bg-gold-hover',
        // Soft red, ONLY for dangerous actions: "Delete account"
        destructive: 'bg-destructive-surface text-destructive hover:bg-destructive/15 focus-visible:ring-destructive/20',
        // Looks like a text link: "Forgot password?"
        link: 'h-auto px-0 text-primary underline-offset-4 hover:underline',
      },
      size: {
        // 44px, the normal app button
        default: 'h-11 px-5',
        // 48px, for forms (login, signup, onboarding)
        lg: 'h-12 px-6',
        // 36px, only for small spots like a table row
        sm: 'h-9 px-3.5 text-sm',
        // 32px, very small
        xs: "h-8 gap-1 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        // Square icon-only buttons
        icon: 'size-11',
        'icon-lg': 'size-12',
        'icon-sm': 'size-9',
        'icon-xs': "size-8 [&_svg:not([class*='size-'])]:size-3.5",
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return <Comp data-slot="button" data-variant={variant} data-size={size} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
