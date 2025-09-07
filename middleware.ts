import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Block access to og-preview page in production
  if (request.nextUrl.pathname.startsWith('/og-preview')) {
    // Check if we're in production environment
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
      // Return 404 response in production
      return new NextResponse(null, { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on og-preview routes
  matcher: '/og-preview/:path*',
};
