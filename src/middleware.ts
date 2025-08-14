import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '../auth';

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define protected paths
  const protectedPaths = ['/home', '/matches'];
  const isProtected = protectedPaths.some((protectedPath) =>
    path.startsWith(protectedPath)
  );

  if (isProtected) {
    // Use NextAuth's auth function to check if user is authenticated
    const session = await auth();
    
    if (!session?.user) {
      // Redirect to sign-in page
      const signInUrl = new URL('/api/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
