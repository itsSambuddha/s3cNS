// app/api/outbound-conference/[confId]/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { OutboundConference } from '@/lib/db/models/OutboundConference'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { canManageDelegationTeam } from '@/lib/delegation-team/access'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ confId: string }> }
) {
  try {
    const { confId } = await params
    await connectToDatabase()
    const conf = await OutboundConference.findById(confId).lean()
    if (!conf) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(conf)
  } catch (err) {
    console.error('[outbound-conference/[confId] GET]', err)
    return NextResponse.json({ error: 'Failed to fetch conference' }, { status: 500 })
  }
}

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
    const body = await req.json()

    const allowedFields = ['name', 'venue', 'dates', 'teamAward', 'teamPhotoUrl', 'photoContactName', 'photoContactNo']
    const update: Record<string, unknown> = {}
    for (const key of allowedFields) {
      if (body[key] !== undefined) update[key] = body[key]
    }

    const updated = await OutboundConference.findByIdAndUpdate(
      confId,
      { $set: update },
      { new: true }
    ).lean()

    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('[outbound-conference/[confId] PATCH]', err)
    return NextResponse.json({ error: 'Failed to update conference' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
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
    await OutboundConference.findByIdAndDelete(confId)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[outbound-conference/[confId] DELETE]', err)
    return NextResponse.json({ error: 'Failed to delete conference' }, { status: 500 })
  }
}
