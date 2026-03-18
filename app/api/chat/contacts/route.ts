// app/api/chat/contacts/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { User } from '@/lib/db/models/User'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectToDatabase()

    // Fetch all active/applicant secretariat members (excluding self)
    const contacts = await User.find({
      uid: { $ne: currentUser.uid },
      memberStatus: { $in: ['ACTIVE', 'APPLICANT'] },
      role: { $in: ['ADMIN', 'LEADERSHIP', 'TEACHER', 'OFFICE_BEARER', 'MEMBER'] }
    }).select('uid displayName email photoURL secretariatRole role')
      .sort({ displayName: 1 })

    return NextResponse.json({ contacts })
  } catch (error: any) {
    console.error('Fetch contacts error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
