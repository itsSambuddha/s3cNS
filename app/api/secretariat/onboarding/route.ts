// app/api/secretariat/onboarding/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { User } from '@/lib/db/models/User'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { applyRolePermissions } from '@/lib/secretariat/permissions'

export async function POST(req: Request) {
  await connectToDatabase()
  const current = await getCurrentUser()
  if (!current) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const {
    displayName,
    phone,
    rollNo,
    year,
    academicDepartment,
    secretariatRole,
    office,
  } = await req.json()

  if (
    ![
      'PRESIDENT',
      'SECRETARY_GENERAL',
      'DIRECTOR_GENERAL',
      'USG',
      'TEACHER',
      'MEMBER',
    ].includes(secretariatRole)
  ) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  // leadership / teacher constraints
  if (
    ['PRESIDENT', 'SECRETARY_GENERAL', 'DIRECTOR_GENERAL'].includes(
      secretariatRole
    )
  ) {
    const count = await User.countDocuments({
      secretariatRole,
      memberStatus: 'ACTIVE',
      _id: { $ne: current._id },
    })
    if (count >= 1) {
      return NextResponse.json(
        { error: `${secretariatRole} slot already filled` },
        { status: 400 }
      )
    }
  }

  if (secretariatRole === 'TEACHER') {
    const count = await User.countDocuments({
      secretariatRole: 'TEACHER',
      memberStatus: 'ACTIVE',
      _id: { $ne: current._id },
    })
    if (count >= 3) {
      return NextResponse.json(
        { error: 'Teacher limit reached (3)' },
        { status: 400 }
      )
    }
  }

  const user = await User.findById(current._id)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  if (displayName) user.displayName = displayName
  user.phone = phone
  user.rollNo = rollNo
  user.year = year
  user.academicDepartment = academicDepartment
  user.secretariatRole = secretariatRole
  user.office =
    secretariatRole === 'USG'
      ? office || null
      : null // leadership/teachers have no office

  // status: leadership & teachers auto-approved; USG = applicant; others = active
  if (
    ['PRESIDENT', 'SECRETARY_GENERAL', 'DIRECTOR_GENERAL', 'TEACHER'].includes(
      secretariatRole
    )
  ) {
    user.memberStatus = 'ACTIVE'
  } else if (secretariatRole === 'USG') {
    user.memberStatus = 'APPLICANT'
  } else {
    user.memberStatus = 'ACTIVE'
  }

  applyRolePermissions(user)
  await user.save()

  return NextResponse.json({ ok: true })
}