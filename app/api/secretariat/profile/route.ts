// app/api/secretariat/profile/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { User } from '@/lib/db/models/User'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      uid,
      displayName,
      phone,
      rollNo,
      year,
      academicDepartment,
      tagline,
    } = body

    if (!uid) {
      return NextResponse.json({ error: 'Missing uid' }, { status: 400 })
    }

    await connectToDatabase()

    const user = await User.findOneAndUpdate(
      { uid },
      {
        $set: {
          displayName,
          phone,
          rollNo,
          year,
          academicDepartment,
          // if you add `tagline` to your schema, set it here too
        },
      },
      { new: true },
    ).lean()

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({ ok: true, user })
  } catch (err: any) {
    console.error('profile update error', err?.message ?? err)
    return NextResponse.json(
      { error: 'Could not update profile' },
      { status: 500 },
    )
  }
}
