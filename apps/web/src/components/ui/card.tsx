import * as React from 'react';

import { cn } from '@/lib/utils';

// The looks a card can have
const cardLooks = {
  // White card with a soft shadow (most cards)
  default: 'border-border bg-card shadow-card',
  // Pale green, no shadow (side panels, quiet boxes)
  soft: 'border-border bg-surface-soft',
  // Warm cream, no shadow (break-related cards)
  cream: 'border-border bg-surface-cream',
  // Pale purple, AI only
  ai: 'border-ai-border bg-ai-surface',
  // Gold edge, Pro plan only
  pro: 'border-2 border-pro-border bg-card shadow-card',
} as const;

type CardLook = keyof typeof cardLooks;

function Card({
  className,
  size = 'default',
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & {
  size?: 'default' | 'sm';
  variant?: CardLook;
}) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-variant={variant}
      className={cn(
        'group/card text-card-foreground flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl border py-(--card-spacing) text-base [--card-spacing:--spacing(6)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(4)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl',
        cardLooks[variant],
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)',
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        'font-heading text-[22px] leading-7.5 font-semibold group-data-[size=sm]/card:text-lg group-data-[size=sm]/card:leading-6.5',
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-description" className={cn('text-muted-foreground text-sm leading-5.5', className)} {...props} />;
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-action" className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('px-(--card-spacing)', className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="card-footer" className={cn('bg-surface-soft flex items-center rounded-b-xl border-t p-(--card-spacing)', className)} {...props} />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
