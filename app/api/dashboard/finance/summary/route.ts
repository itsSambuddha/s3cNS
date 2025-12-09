import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { FinanceRecord } from '@/lib/db/models/FinanceRecord'

export async function GET() {
  try {
    await connectToDatabase()

    // Only BUDGET records
    const budgets = await FinanceRecord.find({ type: 'BUDGET' })
      .select('status')
      .lean()

    const total = budgets.length
    const onTrack = budgets.filter((b: any) =>
      ['PLANNED', 'APPROVED'].includes((b.status || '').toUpperCase()),
    ).length

    return NextResponse.json({ totalBudgets: total, budgetsOnTrack: onTrack })
  } catch (err: any) {
    console.error('finance dashboard summary error', err?.message ?? err)
    return NextResponse.json(
      { error: 'Failed to load finance summary' },
      { status: 500 },
    )
  }
}
