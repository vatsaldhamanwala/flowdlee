'use client';

import { ApiClientError } from '@/lib/api/client';
import { userLoginSchema } from '@/modules/auth/validators/auth.schema';
import { useAuth } from '@/providers/auth-provider';
import { CircleAlert, LoaderCircle, Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

type FieldErrors = {
  email?: string;
  password?: string;
};

export function LoginForm() {
  const router = useRouter();

  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldError] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function validate(): boolean {
    const result = userLoginSchema.safeParse({ email, password });

    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FieldErrors;
        if (!errors[field]) errors[field] = issue.message;
      }
      setFieldError(errors);
      return false;
    }

    setFieldError({});
    return true;
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setFormError(null);

    if (!validate()) return;

    setIsLoading(true);

    try {
      await login({ email, password });

      router.replace('/dashboard');
    } catch (err) {
      if (err instanceof ApiClientError && err.details?.length) {
        const errors: FieldErrors = {};
        for (const detail of err.details) {
          const field = detail.field as keyof FieldErrors;
          if (!errors[field]) errors[field] = detail.message;
        }
        setFieldError(errors);
      } else if (err instanceof ApiClientError) {
        setFormError(err.message); // "Invalid email or password"
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {formError && (
        <div
          role="alert"
          className="border-destructive/30 bg-destructive-surface text-destructive flex items-start gap-3 rounded-lg border px-4 py-3 text-sm"
        >
          <CircleAlert className="mt-0.5 size-4.5 shrink-0" aria-hidden />
          <span>{formError}</span>
        </div>
      )}

      {/* EMAIL */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email address</Label>
        <div className="relative">
          <Mail aria-hidden className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            className="pl-11"
          />
        </div>
        {fieldErrors.email && (
          <p id="email-error" className="text-destructive text-sm">
            {fieldErrors.email}
          </p>
        )}
      </div>

      {/* PASSWORD */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="password">Password</Label>
          <span className="text-muted-foreground flex items-center gap-2 text-sm">
            Forgot password?
            <Badge variant="cream">Soon</Badge>
          </span>
        </div>
        <div className="relative">
          <Lock aria-hidden className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2" />
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            aria-invalid={!!fieldErrors.password}
            aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            className="pl-11"
          />
        </div>
        {fieldErrors.password && (
          <p id="password-error" className="text-destructive text-sm">
            {fieldErrors.password}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <LoaderCircle className="animate-spin" aria-hidden />
            Logging in…
          </>
        ) : (
          'Log in'
        )}
      </Button>
    </form>
  );
}
