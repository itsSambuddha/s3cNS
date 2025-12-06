
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(req: NextRequest) {
  const session = req.cookies.get('s3cns_session')?.value

  const protectedPaths = [
    '/dashboard',
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

  if (isProtected) {
    if (!session) {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('from', req.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    try {
      await jwtVerify(session, secret)
    } catch (error) {
      console.error('JWT Verification failed:', error)
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('from', req.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

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
