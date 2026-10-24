'use client';

import { ApiClientError } from '@/lib/api/client';
import { userLoginSchema } from '@/modules/auth/validators/auth.schema';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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

  //   async function handleSubmit(e: React.FormEvent) {
  //     e.preventDefault();
  //     setFormError(null);

  //     if (!validate()) return;

  //     setIsLoading(true);
  //     try {
  //       const result = await signIn('credentials', {
  //         email,
  //         password,
  //         redirect: false,
  //       });

  //       if (result?.error) {
  //         setFormError('Invalid email or password');
  //         return;
  //       }

  //       router.push('/dashboard');
  //       router.refresh();
  //     } catch {
  //       setFormError('Something went wrong. Please try again.');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  async function handleSubmit(e: React.FormEvent) {
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
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4" noValidate>
      {formError && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</div>}

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className={`w-full rounded-md border px-3 py-2 text-sm disabled:opacity-50 ${fieldErrors.email ? 'border-red-400' : ''}`}
          placeholder="you@example.com"
        />
        {fieldErrors.email && <p className="text-xs text-red-600">{fieldErrors.email}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className={`w-full rounded-md border px-3 py-2 text-sm disabled:opacity-50 ${fieldErrors.password ? 'border-red-400' : ''}`}
          placeholder="••••••••"
        />
        {fieldErrors.password && <p className="text-xs text-red-600">{fieldErrors.password}</p>}
      </div>
      <button type="submit" disabled={isLoading} className="w-full rounded-md bg-black py-2 text-sm font-medium text-white disabled:opacity-50">
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
