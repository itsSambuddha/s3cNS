import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { FinanceProposal } from '@/lib/db/models/FinanceProposal'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      title,
      eventName,
      toEmails,
      sections,
      lineItems,
      createdByUid,
      existingProposalId,
    } = body

    if (!title || !createdByUid) {
      return NextResponse.json(
        { error: 'Missing title or createdByUid' },
        { status: 400 },
      )
    }

    await connectToDatabase()

    const payload = {
      title,
      eventName: eventName || null,
      toEmails: Array.isArray(toEmails) ? toEmails : [],
      sections: Array.isArray(sections) ? sections : [],
      lineItems: Array.isArray(lineItems) ? lineItems : [],
      status: 'DRAFT',
    }

    let proposal

    if (existingProposalId) {
      proposal = await FinanceProposal.findByIdAndUpdate(
        existingProposalId,
        {
          ...payload,
          updatedByUid: createdByUid,
        },
        { new: true },
      ).lean()
    } else {
      proposal = await FinanceProposal.create({
        ...payload,
        createdByUid,
        updatedByUid: createdByUid,
      })
    }

    if (!proposal) {
      return NextResponse.json(
        { error: 'Failed to upsert proposal' },
        { status: 500 },
      )
    }

    return NextResponse.json({ proposalId: proposal._id })
  } catch (err: any) {
    console.error('from-budget error', err?.message ?? err)
    return NextResponse.json(
      { error: 'Failed to create proposal from budget' },
      { status: 500 },
    )
  }
}
