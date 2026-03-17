// app/api/secretariat/applicants/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { User } from '@/lib/db/models/User'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { isAuthorizedAdmin } from '@/lib/auth/permissions'


export async function GET() {
  await connectToDatabase()
  const current = await getCurrentUser()
  if (!isAuthorizedAdmin(current)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // DIAGNOSTIC LOGGING
  const totalUsers = await User.countDocuments({});
  const allApplicantsDirect = await User.find({ memberStatus: 'APPLICANT' }).lean();
  const allUsersSample = await User.find({}).limit(10).select('displayName email memberStatus secretariatRole year').lean();
  
  console.log(`[ApplicantsDebug] Total Users in DB: ${totalUsers}`);
  console.log(`[ApplicantsDebug] Direct 'APPLICANT' count: ${allApplicantsDirect.length}`);
  console.log(`[ApplicantsDebug] Sample Users:`, JSON.stringify(allUsersSample, null, 2));

  // Simplified query for now to minimize logic errors
  const applicants = await User.find({
    $or: [
      { memberStatus: 'APPLICANT' },
      { memberStatus: { $exists: false } },
      { memberStatus: null },
      { memberStatus: '' }
    ]
  })
    .select(
      'displayName email academicDepartment year office rollNo memberStatus secretariatRole'
    )
    .lean()
    .exec()

  // Filter out those who are clearly NOT onboarding (e.g. just a base user record)
  const filteredApplicants = applicants.filter(a => {
    const isMember = a.secretariatRole === 'MEMBER';
    const hasYear = !!a.year;
    // If they are a MEMBER, they MUST have a year to be considered an "applicant"
    // (since default role is MEMBER)
    if (isMember) return hasYear;
    return true;
  });

  console.log(`[ApplicantsDebug] Found ${applicants.length} raw applicants candidate. Final filtered: ${filteredApplicants.length}`);

  return NextResponse.json({ applicants: filteredApplicants })
}

export async function POST(req: Request) {
  await connectToDatabase()
  const current = await getCurrentUser()
  if (!isAuthorizedAdmin(current)) {
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