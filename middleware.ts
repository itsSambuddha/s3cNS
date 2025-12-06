// middleware.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// For now, do not enforce auth at the edge.
// Dashboard and other pages will guard themselves with useAuth.
export async function middleware(req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/budget/:path*',
    '/documents/:path*',
    '/news/:path*',
    '/achievements/:path*',
    '/directory/:path*',
    '/admin/:path*',
  ],
}
