import type { Metadata } from 'next';
import Link from 'next/link';

import { AuthShell } from '@/components/auth/auth-shell';
import { LoginForm } from '@/components/auth/login-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Log in · Flowdlee',
};

export default function Login() {
  return (
    <AuthShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl leading-11 font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground text-sm leading-5.5">Enter your details to resume your focus.</p>
        </div>

        <LoginForm />

        <div className="text-muted-foreground before:bg-border after:bg-border flex items-center gap-4 text-xs font-semibold tracking-[0.08em] uppercase before:h-px before:flex-1 after:h-px after:flex-1">
          or continue with
        </div>

        <Button variant="secondary" size="lg" className="w-full" disabled>
          Continue with Google
          <Badge variant="cream">Coming soon</Badge>
        </Button>

        <p className="text-muted-foreground text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary font-semibold underline-offset-4 hover:underline">
            Start free
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
