// app/api/secretariat/applicants/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { User } from '@/lib/db/models/User'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'

export async function GET() {
  await connectToDatabase()
  const current = await getCurrentUser()
  if (!current || !current.canApproveUSG) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const applicants = await User.find({
    secretariatRole: 'USG',
    memberStatus: 'APPLICANT',
  })
    .select(
      'displayName email academicDepartment year office rollNo memberStatus'
    )
    .lean()
    .exec()

  return NextResponse.json({ applicants })
}

export async function POST(req: Request) {
  await connectToDatabase()
  const current = await getCurrentUser()
  if (!current || !current.canApproveUSG) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { userId, action } = await req.json()
  if (!userId || !['APPROVE', 'REJECT'].includes(action)) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  const user = await User.findById(userId)
  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (action === 'APPROVE') {
    user.memberStatus = 'ACTIVE'
  } else {
    user.memberStatus = 'REJECTED'
  }

  await user.save()
  return NextResponse.json({ ok: true })
}