'use client';

import { useAuth } from '@/providers/auth-provider';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p className="mt-2 text-sm">Signed in as {user?.email}</p>
    </div>
  );
}
