import { LoginForm } from '@/components/auth/login-form';

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Log in to Flowdlee</h1>
          <p className="text-muted-foreground text-sm">Enter your credentials to continue</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
