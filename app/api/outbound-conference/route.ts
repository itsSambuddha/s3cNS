// app/api/outbound-conference/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { OutboundConference } from '@/lib/db/models/OutboundConference'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { canManageDelegationTeam } from '@/lib/delegation-team/access'

export async function GET() {
  try {
    await connectToDatabase()
    const conferences = await OutboundConference.find({})
      .sort({ createdAt: -1 })
      .select('_id name venue dates teamAward teamPhotoUrl createdAt delegates')
      .lean()
    return NextResponse.json(conferences)
  } catch (err) {
    console.error('[outbound-conference GET]', err)
    return NextResponse.json({ error: 'Failed to fetch conferences' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const authUser = await getCurrentUser()
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!canManageDelegationTeam(authUser)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await connectToDatabase()
    const body = await req.json()
    const { name, venue, dates } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Conference name is required' }, { status: 400 })
    }

    const conference = await OutboundConference.create({
      name: name.trim(),
      venue: venue?.trim() ?? '',
      dates: Array.isArray(dates) ? dates : [],
      delegates: [],
      createdBy: authUser.uid,
    })

    return NextResponse.json(conference, { status: 201 })
  } catch (err) {
    console.error('[outbound-conference POST]', err)
    return NextResponse.json({ error: 'Failed to create conference' }, { status: 500 })
  }
}
