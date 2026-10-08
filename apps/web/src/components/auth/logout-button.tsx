// src/components/auth/logout-button.tsx
'use client';

import { signOut } from 'next-auth/react';

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ redirectTo: '/' })}
      className="text-muted-foreground hover:text-foreground cursor-pointer text-sm transition-colors"
    >
      Log out
    </button>
  );
}
