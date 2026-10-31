import Link from 'next/link';
import { Leaf } from 'lucide-react';

import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn('focus-visible:ring-ring/50 inline-flex items-center gap-2.5 self-start rounded-lg outline-none focus-visible:ring-3', className)}
    >
      <span className="bg-primary text-primary-foreground grid size-9 place-items-center rounded-md">
        <Leaf className="size-5" aria-hidden />
      </span>
      <span className="text-xl font-bold tracking-tight">Flowdlee</span>
    </Link>
  );
}
