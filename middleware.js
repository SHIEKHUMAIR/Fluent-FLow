
import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;

  // Define protected routes
  const protectedRoutes = [
    '/dashboard', 
    '/profile', 
    '/assessment', 
    '/features', 
    '/modules',
    '/lessons',
    '/leaderboard'
  ];

  // Check if the current path starts with any of the protected routes
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

  // Get the auth token from cookies
  const token = request.cookies.get('authToken')?.value;

  // If trying to access a protected route without a token, redirect to login
  if (isProtectedRoute && !token) {
    const response = NextResponse.redirect(new URL('/auth', request.url));
    response.cookies.delete('authToken'); // Ensure cookie is clear if invalid access
    return response;
  }

  // If trying to access auth page while logged in, redirect to dashboard
  if (path === '/auth' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
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
     * - assets (public assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};
