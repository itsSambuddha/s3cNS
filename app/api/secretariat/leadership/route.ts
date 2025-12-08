// app/api/secretariat/leadership/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { User } from '@/lib/db/models/User'

export async function GET() {
  try {
    await connectToDatabase()

    const users = await User.find({
      secretariatRole: {
        $in: ['PRESIDENT', 'SECRETARY_GENERAL', 'DIRECTOR_GENERAL', 'TEACHER'],
      },
      memberStatus: 'ACTIVE',
    })
      .select(
        'displayName email phone academicDepartment year secretariatRole photoURL',
      )
      .lean()

    return NextResponse.json({ users })
  } catch (err: any) {
    console.error('leadership api error', err?.message ?? err)
    return NextResponse.json(
      { error: 'Failed to load leadership' },
      { status: 500 },
    )
  }
}
