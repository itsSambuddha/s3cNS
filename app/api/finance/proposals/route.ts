// app/api/finance/proposals/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { FinanceProposal } from '@/lib/db/models/FinanceProposal'

export async function GET() {
  try {
    await connectToDatabase()

    const proposals = await FinanceProposal.find({})
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean()

    return NextResponse.json({ proposals })
  } catch (err: any) {
    console.error('proposals list error', err?.message ?? err)
    return NextResponse.json(
      { error: 'Failed to load proposals' },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      id, // optional, for updates
      title,
      eventName,
      toEmails,
      sections,
      lineItems,
      createdByUid,
    } = body

    if (!title || !createdByUid) {
      return NextResponse.json(
        { error: 'Missing title or createdByUid' },
        { status: 400 },
      )
    }

    await connectToDatabase()

    if (id) {
      // update existing
      const updated = await FinanceProposal.findByIdAndUpdate(
        id,
        {
          title,
          eventName: eventName || null,
          toEmails: Array.isArray(toEmails) ? toEmails : [],
          sections: Array.isArray(sections) ? sections : [],
          lineItems: Array.isArray(lineItems) ? lineItems : [],
          updatedByUid: createdByUid,
        },
        { new: true },
      ).lean()

      if (!updated) {
        return NextResponse.json(
          { error: 'Proposal not found' },
          { status: 404 },
        )
      }

      console.log('Updated proposal:', updated._id)
      return NextResponse.json({ proposal: updated })
    }

    // create new
    const created = await FinanceProposal.create({
      title,
      eventName: eventName || null,
      toEmails: Array.isArray(toEmails) ? toEmails : [],
      sections: Array.isArray(sections) ? sections : [],
      lineItems: Array.isArray(lineItems) ? lineItems : [],
      status: 'DRAFT',
      createdByUid,
      updatedByUid: createdByUid,
    })

    return NextResponse.json({ proposal: created })
  } catch (err: any) {
    console.error('proposal create/update error', err?.message ?? err)
    return NextResponse.json(
      { error: 'Failed to save proposal' },
      { status: 500 },
    )
  }
}
