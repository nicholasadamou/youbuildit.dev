import { NextRequest, NextResponse } from 'next/server';

// Next 16 renamed the `middleware` file convention to `proxy`.
export default function proxy(req: NextRequest) {
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
