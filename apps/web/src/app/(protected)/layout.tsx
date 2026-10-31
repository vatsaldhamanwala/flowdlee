import { ProtectedRoute } from '@/components/auth/route-guards';
import DashboardLayout from '@/components/layouts/dashboard-layout';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
