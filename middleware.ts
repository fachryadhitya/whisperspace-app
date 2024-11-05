import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check local storage instead of cookies
  const isAuthPage = request.nextUrl.pathname === '/join';
  const isChatPage = request.nextUrl.pathname.startsWith('/chat');
  const isHomePage = request.nextUrl.pathname === '/';

  // Allow access to the home page
  if (isHomePage) {
    return NextResponse.next();
  }

  // For API routes or other non-page routes, proceed normally
  if (!isAuthPage && !isChatPage) {
    return NextResponse.next();
  }

  // Let the client-side handle auth redirects
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
