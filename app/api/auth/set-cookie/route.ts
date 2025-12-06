// app/api/auth/set-cookie/route.ts
import { NextResponse } from 'next/server'
import { getAuth } from 'firebase-admin/auth'
import { initFirebaseAdmin } from '@/lib/firebase/admin'

export async function POST(req: Request) {
  try {
    initFirebaseAdmin()

    const { idToken } = await req.json()
    if (!idToken) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 })
    }

    const decoded = await getAuth().verifyIdToken(idToken)

    console.log('set-cookie: verified uid', decoded.uid)

    const res = NextResponse.json({ ok: true })

    res.cookies.set('auth_token', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return res
  } catch (error) {
    console.error('set-cookie error', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
