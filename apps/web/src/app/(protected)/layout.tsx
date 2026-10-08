// app/(dashboard)/layout.tsx
import { auth } from '@/auth';
import { LogoutButton } from '@/components/auth/logout-button';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between border-b px-6 py-4">
        <span className="font-semibold">Flowdlee</span>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground text-sm">{session?.user?.name}</span>
          <LogoutButton />
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}
