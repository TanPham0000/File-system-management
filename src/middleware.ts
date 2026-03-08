import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const role = request.cookies.get('role')?.value;
  const clientId = request.cookies.get('client_id')?.value;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === '/login';
  const isAdminRoute = pathname.startsWith('/admin');
  const isVaultRoute = pathname.startsWith('/vault') || pathname === '/';

  // 1. If trying to access login page while already authenticated
  if (isLoginPage && role) {
    if (role === 'admin') return NextResponse.redirect(new URL('/admin', request.url));
    if (role === 'client') return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. Protect Admin Routes
  if (isAdminRoute && role !== 'admin') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Protect Client Routes (Vaults)
  if (isVaultRoute && !isAdminRoute) {
    if (!role) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Advanced: could check if client_id actually matches the vault id they are trying to access
    // For now, any logged-in client can see their overview, and we filter data there.
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
