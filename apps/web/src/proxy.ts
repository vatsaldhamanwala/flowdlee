import { auth } from '@/auth.edge';
import { NextResponse } from 'next/server';

export default auth((req) => {
  if (!req.auth) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // later: onboarding redirect, subscription redirect, admin routes, etc.
});

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/planner/:path*', '/analytics/:path*'],
};
