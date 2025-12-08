// app/api/finance/budgets/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { FinanceRecord } from '@/lib/db/models/FinanceRecord'

/**
 * GET /api/finance/budgets?eventId=...&eventName=...
 * Returns existing budget items for an event/campaign
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('eventId')
    const eventName = searchParams.get('eventName')

    if (!eventId && !eventName) {
      return NextResponse.json(
        { error: 'eventId or eventName is required' },
        { status: 400 },
      )
    }

    await connectToDatabase()

    const query: Record<string, any> = { type: 'BUDGET' }
    if (eventId) query.eventId = eventId
    if (eventName) query.eventName = eventName

    const records = await FinanceRecord.find(query)
      .sort({ createdAt: 1 })
      .lean()

    const items = records.map((r) => ({
      id: String(r._id),
      budgetItem: r.notes || '', // we will store line item name in notes OR add a dedicated field later
      units: 1,
      pricePerUnit: r.amount,
      remarks: r.eventName || '',
    }))

    return NextResponse.json({ items })
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to load budget' },
      { status: 500 },
    )
  }
}

/**
 * POST /api/finance/budgets
 * Body: { eventId?, eventName?, items: [{ budgetItem, units, pricePerUnit, remarks }], createdByUid }
 * Overwrites existing BUDGET records for that event and inserts new ones.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { eventId, eventName, items, createdByUid } = body

    if ((!eventId && !eventName) || !createdByUid || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Missing event or items or createdByUid' },
        { status: 400 },
      )
    }

    await connectToDatabase()

    const query: Record<string, any> = { type: 'BUDGET' }
    if (eventId) query.eventId = eventId
    if (eventName) query.eventName = eventName

    await FinanceRecord.deleteMany(query)

    const docs = items
      .filter(
        (it: any) =>
          it &&
          typeof it.budgetItem === 'string' &&
          it.budgetItem.trim().length > 0 &&
          Number(it.units) > 0 &&
          Number(it.pricePerUnit) >= 0,
      )
      .map((it: any) => {
        const units = Number(it.units)
        const pricePerUnit = Number(it.pricePerUnit)
        const amount = units * pricePerUnit

        return {
          type: 'BUDGET',
          eventId: eventId || null,
          eventName: eventName || null,
          category: 'MISC',
          amount,
          currency: 'INR',
          status: 'PLANNED',
          date: new Date(),
          notes: it.budgetItem.trim(),
          createdByUid,
          updatedByUid: createdByUid,
        }
      })

    if (!docs.length) {
      return NextResponse.json({ items: [] })
    }

    const created = await FinanceRecord.insertMany(docs)

    return NextResponse.json({
      items: created.map((r) => ({
        id: String(r._id),
        budgetItem: r.notes || '',
        units: 1,
        pricePerUnit: r.amount,
        remarks: r.eventName || '',
      })),
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to save budget' },
      { status: 500 },
    )
  }
}
