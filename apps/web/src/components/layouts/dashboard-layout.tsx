'use client';

import { useAuth } from '@/providers/auth-provider';
import { LogoutButton } from '../auth/logout-button';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between border-b px-6 py-4">
        <span className="font-semibold">Flowdlee</span>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground text-sm">{user?.name}</span>
          <LogoutButton />
        </div>
      </nav>

      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
