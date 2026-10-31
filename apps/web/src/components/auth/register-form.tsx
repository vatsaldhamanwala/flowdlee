'use client';

import { ArrowRight, CircleAlert, LoaderCircle, Lock, Mail, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiClientError } from '@/lib/api/client';
import { userRegisterSchema } from '@/modules/auth/validators/auth.schema';
import { useAuth } from '@/providers/auth-provider';

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  terms?: string;
};

const iconClass = 'pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-muted-foreground';

export function RegisterForm() {
  const router = useRouter();

  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function validate() {
    const errors: FieldErrors = {};

    const result = userRegisterSchema.safeParse({ name, email, password });
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FieldErrors;
        if (!errors[field]) errors[field] = issue.message;
      }
    }

    // The terms box is checked only here in the browser. The server does not need it.
    if (!agreed) {
      errors.terms = 'Please accept the terms to continue.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setFormError(null);

    if (!validate()) return;

    setIsLoading(true);
    try {
      const { loggedIn } = await register({ name, email, password });
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

      {/* FULL NAME */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Full name</Label>
        <div className="relative">
          <User aria-hidden className={iconClass} />
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Alex Rivera"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? 'name-error' : undefined}
            className="pl-11"
          />
        </div>
        {fieldErrors.name && (
          <p id="name-error" className="text-destructive text-sm">
            {fieldErrors.name}
          </p>
        )}
      </div>

      {/* EMAIL */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email address</Label>
        <div className="relative">
          <Mail aria-hidden className={iconClass} />
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

      {/* PASSWORD with Show / Hide */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="password">Password</Label>
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-controls="password"
            aria-pressed={showPassword}
            className="text-primary focus-visible:ring-ring/50 rounded-sm text-sm font-semibold outline-none hover:underline focus-visible:ring-3"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className="relative">
          <Lock aria-hidden className={iconClass} />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="At least 8 characters"
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

      {/* TERMS */}
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            checked={agreed}
            onCheckedChange={(value) => setAgreed(value === true)}
            disabled={isLoading}
            aria-invalid={!!fieldErrors.terms}
            aria-describedby={fieldErrors.terms ? 'terms-error' : undefined}
            className="mt-0.5"
          />
          {/* TODO: link "Terms" and "Privacy Policy" once those pages exist */}
          <Label htmlFor="terms" className="text-muted-foreground leading-5.5 font-normal">
            I agree to the Terms and Privacy Policy.
          </Label>
        </div>
        {fieldErrors.terms && (
          <p id="terms-error" className="text-destructive text-sm">
            {fieldErrors.terms}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <LoaderCircle className="animate-spin" aria-hidden />
            Creating account…
          </>
        ) : (
          <>
            Create account
            <ArrowRight aria-hidden />
          </>
        )}
      </Button>
    </form>
  );
}
