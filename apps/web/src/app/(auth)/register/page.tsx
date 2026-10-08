import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Create your Flowdlee account</h1>
          <p className="text-muted-foreground text-sm">Start building healthier work habits</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
