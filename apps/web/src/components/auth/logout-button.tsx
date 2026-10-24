import { useAuth } from '@/providers/auth-provider';

export function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button type="button" onClick={() => logout()} className="text-muted-foreground hover:text-foreground cursor-pointer text-sm transition-colors">
      Log out
    </button>
  );
}
