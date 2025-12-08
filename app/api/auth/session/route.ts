
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import admin from 'firebase-admin'
import { SignJWT, jwtVerify } from 'jose'

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_JSON as string
)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function POST(req: Request) {
  const { idToken } = await req.json()
  const cookieStore = await cookies()

  if (!idToken) {
    cookieStore.set('s3cns_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })
    return NextResponse.json({ ok: true })
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    const { uid, email } = decodedToken

    const jwt = await new SignJWT({ uid, email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(secret)

    cookieStore.set('s3cns_session', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error verifying ID token or creating session:', error)
    return NextResponse.json({ ok: false, error: 'Invalid token' }, { status: 401 })
  }
}
