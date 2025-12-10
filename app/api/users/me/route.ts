// app/api/users/me/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { User } from '@/lib/db/models/User'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { uid, email, displayName, photoURL } = body

    if (!uid || !email) {
      return NextResponse.json(
        { error: 'Missing uid or email' },
        { status: 400 },
      )
    }

    await connectToDatabase()

    const user = await User.findOneAndUpdate(
      { uid },
      {
        $setOnInsert: {
          uid,
          email,
          displayName: displayName || email,
          photoURL: photoURL || undefined,
        },
      },
      { new: true, upsert: true },
    ).lean()

    return NextResponse.json({ user })
  } catch (err: any) {
    console.error('users/me error', err?.message ?? err)
    return NextResponse.json(
      { error: 'Failed to load user' },
      { status: 500 },
    )
  }
}
