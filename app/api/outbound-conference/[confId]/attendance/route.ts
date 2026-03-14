// app/api/outbound-conference/[confId]/attendance/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { OutboundConference } from '@/lib/db/models/OutboundConference'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { canManageDelegationTeam } from '@/lib/delegation-team/access'

/**
 * PATCH /api/outbound-conference/[confId]/attendance
 * Body: { delegateId: string, date: string, value: 'PRESENT' | 'ABSENT' }
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ confId: string }> }
) {
  try {
    const { confId } = await params
    const authUser = await getCurrentUser()
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!canManageDelegationTeam(authUser)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await connectToDatabase()
    const { delegateId, date, value } = await req.json()

    if (!delegateId || !date || !['PRESENT', 'ABSENT'].includes(value)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const updated = await OutboundConference.findOneAndUpdate(
      { _id: confId, 'delegates._id': delegateId },
      { $set: { [`delegates.$.attendanceDays.${date}`]: value } },
      { new: true }
    ).lean()

    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('[attendance PATCH]', err)
    return NextResponse.json({ error: 'Failed to update attendance' }, { status: 500 })
  }
}
