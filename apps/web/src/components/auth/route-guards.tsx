'use client';

import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function FullPageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Loading…</p>
    </div>
  );
}

// guard for pages that need a logged-in user
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status !== 'authenticated') {
    return <FullPageLoader />;
  }

  return <>{children}</>;
}

// guard for /login and /register: logged-in people go to the dashboard
export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard');
    }
  }, [status, router]);

  if (status !== 'unauthenticated') {
    return <FullPageLoader />;
  }

  return <>{children}</>;
}
