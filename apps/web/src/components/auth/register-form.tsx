'use client';

import { ApiClientError } from '@/lib/api/client';
import { userRegisterSchema } from '@/modules/auth/validators/auth.schema';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export function RegisterForm() {
  const router = useRouter();

  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function validate() {
    const result = userRegisterSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FieldErrors;
        if (!errors[field]) errors[field] = issue.message;
      }
      setFieldErrors(errors);
      return false;
    }

    setFieldErrors({});
    return true;
  }

  //   async function handleSubmit(e: React.FormEvent) {
  //     e.preventDefault();
  //     setFormError(null);

  //     if (!validate()) return;

  //     setIsLoading(true);
  //     try {
  //       const res = await fetch('/api/v1/auth/register', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ name, email, password, confirmPassword }),
  //       });

  //       if (!res.ok) {
  //         const data = await res.json().catch(() => null);
  //         setFormError(data?.message ?? 'Registration failed. Please try again.');
  //         return;
  //       }

  //       // Auto sign-in after successful registration
  //       const signInResult = await signIn('credentials', {
  //         email,
  //         password,
  //         redirect: false,
  //       });

  //       if (signInResult?.error) {
  //         // Registered fine, but auto-login failed — send them to login instead
  //         router.push('/login');
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
      const { loggedIn } = await register({ name, email, password, confirmPassword }); // ← new line 1
      router.replace(loggedIn ? '/dashboard' : '/login');
    } catch (err) {
      if (err instanceof ApiClientError && err.details?.length) {
        // the server says which boxes are wrong: show red text under them
        const errors: FieldErrors = {};
        for (const detail of err.details) {
          const field = detail.field as keyof FieldErrors;
          if (!errors[field]) errors[field] = detail.message;
        }
        setFieldErrors(errors);
      } else if (err instanceof ApiClientError) {
        // for example "Email already registered"
        setFormError(err.message);
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
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          className={`w-full rounded-md border px-3 py-2 text-sm disabled:opacity-50 ${fieldErrors.name ? 'border-red-400' : ''}`}
          placeholder="Your name"
        />
        {fieldErrors.name && <p className="text-xs text-red-600">{fieldErrors.name}</p>}
      </div>

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
          placeholder="At least 8 characters"
        />
        {fieldErrors.password && <p className="text-xs text-red-600">{fieldErrors.password}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          className={`w-full rounded-md border px-3 py-2 text-sm disabled:opacity-50 ${fieldErrors.confirmPassword ? 'border-red-400' : ''}`}
          placeholder="••••••••"
        />
        {fieldErrors.confirmPassword && <p className="text-xs text-red-600">{fieldErrors.confirmPassword}</p>}
      </div>

      <button type="submit" disabled={isLoading} className="w-full rounded-md bg-black py-2 text-sm font-medium text-white disabled:opacity-50">
        {isLoading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}
