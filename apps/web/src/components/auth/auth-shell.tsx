import { Coffee, Eye, Timer } from 'lucide-react';

import { Logo } from '@/components/brand/logo';

const rhythm = [
  { icon: Timer, label: 'Focus', value: '50 min', tile: 'bg-primary text-primary-foreground' },
  { icon: Coffee, label: 'Break', value: '10 min', tile: 'bg-surface-cream text-gold-ink' },
  { icon: Eye, label: 'Eye rest', value: 'every 25 min', tile: 'bg-primary-tint text-primary' },
];

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1">
      {/* LEFT HALF: brand panel, only on large screens */}
      <aside className="bg-surface-soft relative hidden flex-1 flex-col gap-8 overflow-hidden px-16 py-12 lg:flex">
        {/* soft blurred green circle in the corner (decoration only) */}
        <div aria-hidden className="bg-mint pointer-events-none absolute -top-52 -left-40 size-130 rounded-full opacity-20 blur-[70px]" />

        <Logo className="relative" />

        <div className="relative mt-auto flex max-w-130 flex-col gap-5">
          <p className="text-5xl leading-14 font-bold tracking-tight">A calmer way to structure your workday.</p>
          <p className="text-muted-foreground text-lg leading-7">Plan, focus, pause and reflect, with reminders that keep your rhythm steady.</p>
        </div>

        <div className="bg-card shadow-card relative flex max-w-130 flex-col gap-3 rounded-2xl border p-6">
          <span className="text-muted-foreground text-xs leading-4 font-semibold tracking-[0.08em] uppercase">Today&apos;s rhythm</span>
          {rhythm.map(({ icon: Icon, label, value, tile }) => (
            <div key={label} className="bg-surface-soft flex items-center gap-3 rounded-lg px-4 py-3">
              <span className={`grid size-11 place-items-center rounded-md ${tile}`}>
                <Icon className="size-4.5" aria-hidden />
              </span>
              <span className="flex-1 font-semibold">{label}</span>
              <span className="tabular-nums">{value}</span>
            </div>
          ))}
        </div>

        <p className="text-muted-foreground relative text-xs">© {new Date().getFullYear()} Flowdlee</p>
      </aside>

      {/* RIGHT HALF: whatever page we put inside (login or signup form) */}
      <main className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-16">
        <div className="mx-auto w-full max-w-110">
          <Logo className="mb-10 lg:hidden" />
          {children}
        </div>
      </main>
    </div>
  );
}
