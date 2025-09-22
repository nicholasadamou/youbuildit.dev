import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/admin(.*)', '/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Block access to og-preview page in production
  if (req.nextUrl.pathname.startsWith('/og-preview')) {
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
      return new NextResponse(null, { status: 404 });
    }
  }

  // Protect admin/dashboard routes
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
