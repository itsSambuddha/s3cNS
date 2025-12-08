// app/api/finance/records/summary/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { FinanceRecord } from '@/lib/db/models/FinanceRecord'

export async function GET() {
  try {
    await connectToDatabase()

    const [totals] = await FinanceRecord.aggregate([
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
        },
      },
    ])

    const expensesByCategory = await FinanceRecord.aggregate([
      { $match: { type: 'EXPENSE' } },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
        },
      },
      { $sort: { totalAmount: -1 } },
    ])

    const pendingReimbursements = await FinanceRecord.aggregate([
      {
        $match: {
          type: 'REIMBURSEMENT',
          status: { $in: ['PENDING', 'APPROVED'] },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ])

    const outstandingDues = await FinanceRecord.aggregate([
      {
        $match: {
          type: 'DUE',
          status: { $in: ['PENDING', 'OVERDUE'] },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ])

    return NextResponse.json({
      totalsByType: totals || [],
      expensesByCategory,
      pendingReimbursements: pendingReimbursements[0] || {
        count: 0,
        totalAmount: 0,
      },
      outstandingDues: outstandingDues[0] || { count: 0, totalAmount: 0 },
    })
  } catch (err: any) {
    console.error('finance summary error', err?.message ?? err)
    return NextResponse.json(
      { error: 'Failed to load finance summary' },
      { status: 500 },
    )
  }
}
