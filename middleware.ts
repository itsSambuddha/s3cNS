// middleware.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const session = req.cookies.get('s3cns_session')?.value

  const protectedPaths = [
    '/dashboard',
    '/attendance',
    '/budget',
    '/documents',
    '/news',
    '/achievements',
    '/directory',
    '/admin',
  ]

  const isProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  )

  if (isProtected && !session) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('from', req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/attendance/:path*',
    '/budget/:path*',
    '/documents/:path*',
    '/news/:path*',
    '/achievements/:path*',
    '/directory/:path*',
    '/admin/:path*',
  ],
}
