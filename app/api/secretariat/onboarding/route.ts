// app/api/secretariat/onboarding/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { User } from '@/lib/db/models/User'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      uid,
      email,
      displayName,
      phone,
      rollNo,
      academicDepartment,
      year,
      secretariatRole,
      office,
      officeRank, // 'HEAD' | 'DEPUTY' or similar
      tagline,
      avatarUrl,
    } = body

    if (!uid || !email || !displayName || !secretariatRole) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    await connectToDatabase()

    // Derive app-level role from secretariatRole
    let appRole: 'ADMIN' | 'LEADERSHIP' | 'TEACHER' | 'OFFICE_BEARER' | 'MEMBER' =
      'MEMBER'

    if (
      ['PRESIDENT', 'SECRETARY_GENERAL', 'DIRECTOR_GENERAL'].includes(
        secretariatRole,
      )
    ) {
      appRole = 'ADMIN'
    } else if (secretariatRole === 'TEACHER') {
      appRole = 'TEACHER'
    } else if (secretariatRole === 'USG') {
      appRole = 'OFFICE_BEARER'
    }

    const user = await User.findOneAndUpdate(
      { uid },
      {
        $set: {
          email,
          displayName,
          phone,
          rollNo,
          academicDepartment,
          year,
          secretariatRole,
          office: secretariatRole === 'USG' ? office : null,
          role: appRole,
          memberStatus: 'ACTIVE',
          photoURL: avatarUrl || undefined,
          // simple permissions – you can refine later
          canManageMembers:
            secretariatRole === 'PRESIDENT' ||
            secretariatRole === 'SECRETARY_GENERAL',
          canApproveUSG:
            secretariatRole === 'PRESIDENT' ||
            secretariatRole === 'SECRETARY_GENERAL',
          canManageFinance:
            secretariatRole === 'DIRECTOR_GENERAL' ||
            office === 'FINANCE',
          canManageEvents:
            secretariatRole === 'DIRECTOR_GENERAL' ||
            office === 'CONFERENCE_MANAGEMENT',
        },
      },
      { new: true, upsert: true },
    ).lean()

    if (!user) {
      return NextResponse.json(
        { error: 'User not found after update' },
        { status: 404 },
      )
    }

    return NextResponse.json({ ok: true, user })
  } catch (err: any) {
    console.error('onboarding error', err?.message ?? err)
    return NextResponse.json(
      { error: 'Could not save profile. Please try again.' },
      { status: 500 },
    )
  }
}
