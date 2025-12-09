// app/api/finance/proposals/[id]/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { FinanceProposal } from '@/lib/db/models/FinanceProposal'

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { id } = await params

    await connectToDatabase()

    const proposal = await FinanceProposal.findById(id).lean()
    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({ proposal })
  } catch (err: any) {
    console.error('proposal get error', err?.message ?? err)
    return NextResponse.json(
      { error: 'Failed to load proposal' },
      { status: 500 },
    )
  }
}
