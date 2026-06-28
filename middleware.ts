import { NextRequest, NextResponse } from 'next/server';

export default function middleware(req: NextRequest) {
  // Block access to the og-preview page in production
  if (req.nextUrl.pathname.startsWith('/og-preview')) {
    if (process.env.NODE_ENV === 'production') {
      return new NextResponse(null, { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/og-preview/:path*'],
};
