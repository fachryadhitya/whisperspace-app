import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/auth', '/api/auth'];

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('firebase-auth-token');
  const { pathname } = request.nextUrl;

  // Allow access to public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    // If user is authenticated and trying to access auth page, redirect to home
    if (authCookie && pathname === '/auth') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Protect all other routes
  if (!authCookie) {
    const redirectUrl = new URL('/auth', request.url);
    redirectUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (authentication endpoints)
     * 2. /_next/* (Next.js internals)
     * 3. /_static/* (static files)
     * 4. /_vercel/* (Vercel internals)
     * 5. /favicon.ico, /site.webmanifest (browser files)
     */
    '/((?!api/auth|_next|_static|_vercel|favicon.ico|site.webmanifest).*)',
  ],
};
