// app/api/secretariat/usg/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { User } from '@/lib/db/models/User'

export async function GET() {
  try {
    await connectToDatabase()

    const users = await User.find({
      secretariatRole: 'USG',
      memberStatus: 'ACTIVE',
    })
      .select(
        'displayName academicDepartment year secretariatRole office photoURL',
      )
      .lean()

    return NextResponse.json({ users })
  } catch (err: any) {
    console.error('usg api error', err?.message ?? err)
    return NextResponse.json(
      { error: 'Failed to load USG members' },
      { status: 500 },
    )
  }
}
