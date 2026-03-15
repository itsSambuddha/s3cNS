// app/api/auth/sync/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { User } from '@/lib/db/models/User'

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

    // 1. Try to find user by email (most reliable for account linking)
    // 2. Fallback to finding by uid
    let user = await User.findOne({ 
      $or: [
        { email },
        { uid }
      ] 
    })

    if (!user) {
      // Create new user if none exists with this email or uid
      await User.create({
        uid,
        email,
        displayName,
        photoURL,
      })
    } else {
      // If user exists:
      // - Ensure uid matches (updates uid if user switched login methods)
      // - Update profile details if provided
      user.uid = uid
      user.displayName = displayName ?? user.displayName
      user.photoURL = photoURL ?? user.photoURL
      await user.save()
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error syncing user', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
