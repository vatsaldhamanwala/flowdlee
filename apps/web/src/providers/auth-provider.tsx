'use client';

import { apiFetch } from '@/lib/api/client';
import { UserResponseDTO } from '@/modules/users';
import { createContext, useContext, useEffect, useState } from 'react';

type Status = 'loading' | 'authenticated' | 'unauthenticated';

interface Credentials {
  email: string;
  password: string;
}

interface RegisterInput extends Credentials {
  name: string;
  confirmPassword?: string;
}

interface AuthContextValue {
  user: UserResponseDTO | null;
  status: Status;
  login: (input: Credentials) => Promise<void>;
  register: (input: RegisterInput) => Promise<{ loggedIn: boolean }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponseDTO | null>(null);
  const [status, setStatus] = useState<Status>('loading');

  // when app open first , ask who am I ?

  useEffect(() => {
    apiFetch<UserResponseDTO>('/auth/me')
      .then((me) => {
        setUser(me);
        setStatus('authenticated');
      })
      .catch(() => {
        setStatus('unauthenticated');
      });
  }, []);

  // login
  async function login(input: Credentials) {
    const data = await apiFetch<{ user: UserResponseDTO }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    });

    setUser(data.user);
    setStatus('authenticated');
  }

  // register
  async function register(input: RegisterInput) {
    await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    });

    // logged in directly when user register successfully so they don't have to go to login and enter there credential again
    try {
      await login({ email: input.email, password: input.password });
      return { loggedIn: true };
    } catch {
      return { loggedIn: false };
    }
  }

  // logout
  async function logout() {
    await apiFetch('/auth/logout', {
      method: 'POST',
    }).catch(() => {});

    setUser(null);
    setStatus('unauthenticated');
  }

  return <AuthContext.Provider value={{ user, status, login, register, logout }}> {children} </AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }

  return context;
}
