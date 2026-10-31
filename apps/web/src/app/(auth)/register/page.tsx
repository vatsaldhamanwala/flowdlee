import type { Metadata } from 'next';
import Link from 'next/link';

import { AuthShell } from '@/components/auth/auth-shell';
import { RegisterForm } from '@/components/auth/register-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Create account · Flowdlee',
};

export default function Register() {
  return (
    <AuthShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl leading-11 font-bold tracking-tight">Create your space</h1>
          <p className="text-muted-foreground text-sm leading-5.5">Start building healthier work habits.</p>
        </div>

        <RegisterForm />

        <div className="text-muted-foreground before:bg-border after:bg-border flex items-center gap-4 text-xs font-semibold tracking-[0.08em] uppercase before:h-px before:flex-1 after:h-px after:flex-1">
          or
        </div>

        <Button variant="secondary" size="lg" className="w-full" disabled>
          Continue with Google
          <Badge variant="cream">Coming soon</Badge>
        </Button>

        <p className="text-muted-foreground text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-semibold underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
