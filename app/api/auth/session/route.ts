// app/api/auth/session/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { uid } = await req.json()
  const cookieStore = await cookies()

  // If uid is empty, clear the session cookie (logout)
  if (!uid) {
    cookieStore.set('s3cns_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })
    return NextResponse.json({ ok: true })
  }

  // Otherwise, set session cookie (login)
  cookieStore.set('s3cns_session', uid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  })

  return NextResponse.json({ ok: true })
}
