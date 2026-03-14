// app/api/outbound-conference/[confId]/delegates/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { OutboundConference } from '@/lib/db/models/OutboundConference'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { canManageDelegationTeam } from '@/lib/delegation-team/access'

export async function POST(
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

    const newDelegate = {
      _id: new (require('mongoose').Types.ObjectId)(),
      fullName: body.fullName?.trim() ?? 'New Member',
      semester: body.semester ?? '',
      dept: body.dept ?? '',
      experience: body.experience ?? '',
      rollNo: body.rollNo ?? '',
      attendance: body.attendance ?? 0,
      contactNo: body.contactNo ?? '',
      committeeChoice: body.committeeChoice ?? '',
      committeeReceived: body.committeeReceived ?? '',
      portfolioReceived: body.portfolioReceived ?? '',
      paid: body.paid ?? false,
      doubleDelegateId: body.doubleDelegateId ?? null,
      status: 'PENDING',
      award: null,
      attendanceDays: {},
    }

    // Use raw collection to bypass any potential schema caching issues
    const updated = await OutboundConference.collection.updateOne(
      { _id: new (require('mongoose').Types.ObjectId)(confId) } as any,
      { $push: { delegates: newDelegate } } as any
    )

    if (updated.matchedCount === 0) return NextResponse.json({ error: 'Conference not found' }, { status: 404 })
    
    const fullConf = await OutboundConference.findById(confId).lean()
    return NextResponse.json(fullConf, { status: 201 })
  } catch (err) {
    console.error('[delegates POST]', err)
    return NextResponse.json({ error: 'Failed to add delegate' }, { status: 500 })
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
    const { delegateId, ...fields } = body

    if (!delegateId) {
      return NextResponse.json({ error: 'delegateId is required' }, { status: 400 })
    }

    const conf = await OutboundConference.findById(confId).lean()
    if (!conf) return NextResponse.json({ error: 'Conference not found' }, { status: 404 })

    const delegate = conf.delegates.find((d: any) => String(d._id) === String(delegateId))
    if (!delegate) return NextResponse.json({ error: 'Delegate not found' }, { status: 404 })

    const allowedFields = [
      'fullName', 'semester', 'dept', 'experience', 'rollNo',
      'attendance', 'contactNo', 'committeeChoice', 'committeeReceived',
      'portfolioReceived', 'paid', 'status', 'award',
    ]

    const doubleId = delegate.doubleDelegateId
    const isSyncField = fields.status !== undefined || fields.award !== undefined

    // Prepare update
    let updateOp: any

    if (doubleId && isSyncField) {
      // Sync status/award for BOTH delegates in the pair
      const setPayload: Record<string, any> = {}
      let usesElem = false
      let usesTarget = false

      for (const key of allowedFields) {
        if (fields[key] !== undefined) {
          if (key === 'status' || key === 'award') {
            setPayload[`delegates.$[elem].${key}`] = fields[key]
            usesElem = true
          } else {
            setPayload[`delegates.$[target].${key}`] = fields[key]
            usesTarget = true
          }
        }
      }

      updateOp = { $set: setPayload }
      
      const arrayFilters: any[] = []
      if (usesElem) arrayFilters.push({ 'elem.doubleDelegateId': doubleId })
      if (usesTarget) arrayFilters.push({ 'target._id': new (require('mongoose').Types.ObjectId)(delegateId) })
      
      await OutboundConference.collection.updateOne(
        { _id: new (require('mongoose').Types.ObjectId)(confId) } as any,
        updateOp,
        { arrayFilters } as any
      )
    } else {
      // Normal individual update
      const setPayload: Record<string, any> = {}
      for (const key of allowedFields) {
        if (fields[key] !== undefined) {
          setPayload[`delegates.$.${key}`] = fields[key]
        }
      }
      await OutboundConference.collection.updateOne(
        { _id: new (require('mongoose').Types.ObjectId)(confId), 'delegates._id': new (require('mongoose').Types.ObjectId)(delegateId) } as any,
        { $set: setPayload } as any
      )
    }

    const fullConf = await OutboundConference.findById(confId).lean()
    return NextResponse.json(fullConf)
  } catch (err) {
    console.error('[delegates PATCH]', err)
    return NextResponse.json({ error: 'Failed to update delegate' }, { status: 500 })
  }
}

export async function DELETE(
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
    const { delegateId } = await req.json()
    if (!delegateId) return NextResponse.json({ error: 'delegateId required' }, { status: 400 })

    const updated = await OutboundConference.findByIdAndUpdate(
      confId,
      { $pull: { delegates: { _id: delegateId } } },
      { new: true }
    ).lean()

    if (!updated) return NextResponse.json({ error: 'Conference not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('[delegates DELETE]', err)
    return NextResponse.json({ error: 'Failed to remove delegate' }, { status: 500 })
  }
}
