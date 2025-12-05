// app/api/auth/sync/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/mongodb'
import { User } from '@/lib/db/models'

export async function POST(req: Request) {
  try {
    await connectToDatabase()

    const body = await req.json()
    const { uid, email, displayName, photoURL } = body as {
      uid: string
      email: string
      displayName?: string
      photoURL?: string
    }

    if (!uid || !email) {
      return NextResponse.json({ error: 'Missing uid or email' }, { status: 400 })
    }

    const existing = await User.findOne({ uid })

    if (!existing) {
      await User.create({
        uid,
        email,
        displayName,
        photoURL,
      })
    } else {
      existing.displayName = displayName ?? existing.displayName
      existing.photoURL = photoURL ?? existing.photoURL
      await existing.save()
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error syncing user', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
