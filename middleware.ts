import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  // Get the pathname
  const { pathname } = req.nextUrl;
  
  // Allow access to public routes
  if (pathname === '/' || pathname === '/login') {
    return NextResponse.next();
  }
  
  // Check for authentication on protected routes
  const session = await auth();
  
  // Redirect to login if no session found
  if (!session) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

// Configure which routes to protect
export const config = {
  matcher: [
    // Protected routes
    '/home/:path*',
    '/registrar/:path*',
    '/historico/:path*',
    '/prontuarios/:path*',
    '/perfil/:path*',
  ],
};

