import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from '@/lib/auth/jwt';
// TEMPORARILY DISABLED - Causing module evaluation error
// import { rateLimiter } from '@/lib/rate-limiter';

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const origin = request.headers.get('origin');

  // 1. CORS
  if (origin && (ALLOWED_ORIGINS.includes(origin) || process.env.NODE_ENV === 'development')) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
  }

  // 2. Security Headers
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.stripe.com https://api.openai.com https://generativelanguage.googleapis.com",
    "frame-ancestors 'none'",
    // "base-uri 'self'", // Can break some next.js features if not careful, omitted for now
    "form-action 'self'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.delete('X-Powered-By');

  // 3. Rate Limiting
  // Determine if user is authenticated (lightweight check, no DB)
  const token = request.cookies.get('s3cns_session')?.value;
  let userId: string | null = null;

  if (token) {
    const payload = await verifySessionToken(token);
    if (payload?.uid) {
      userId = payload.uid as string;
      // Inject user ID into headers for rate limiter to use
      request.headers.set('x-user-id', userId);
    }
  }

  // Determine Tier
  const path = request.nextUrl.pathname;
  let tier = 'PUBLIC';

  if (path.startsWith('/api/auth')) tier = 'AUTH';
  else if (path.startsWith('/api/payment')) tier = 'PAYMENT';
  else if (path.startsWith('/api/admin')) tier = 'ADMIN';

  // TEMPORARILY DISABLED - Debugging charCodeAt error
  // Apply Limit
  // const limitResult = await rateLimiter.checkLimit(request, tier as any);

  // if (!limitResult.allowed) {
  //   return new NextResponse(
  //     JSON.stringify({
  //       error: 'Too Many Requests',
  //       message: 'Please try again later',
  //       retryAfter: limitResult.retryAfter
  //     }),
  //     {
  //       status: 429,
  //       headers: {
  //           'Content-Type': 'application/json',
  //           'Retry-After': String(limitResult.retryAfter || 60)
  //       }
  //     }
  //   );
  // }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
