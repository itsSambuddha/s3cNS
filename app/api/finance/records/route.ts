// app/api/finance/records/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import {
  FinanceRecord,
  type FinanceRecordType,
  type FinanceCategory,
  type FinanceStatus,
} from '@/lib/db/models/FinanceRecord'

export async function GET(req: Request) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(req.url)

    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = Math.min(
      parseInt(searchParams.get('pageSize') || '20', 10),
      100,
    )

    const type = searchParams.get('type') as FinanceRecordType | null
    const category = searchParams.get('category') as FinanceCategory | null
    const status = searchParams.get('status') as FinanceStatus | null
    const eventId = searchParams.get('eventId') || null

    const query: Record<string, any> = {}

    if (type) query.type = type
    if (category) query.category = category
    if (status) query.status = status
    if (eventId) query.eventId = eventId

    const total = await FinanceRecord.countDocuments(query)

    const records = await FinanceRecord.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean()

    return NextResponse.json({
      records,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (err: any) {
    console.error('finance records list error', err?.message ?? err)
    return NextResponse.json(
      { error: 'Failed to load finance records' },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      type,
      eventId,
      eventName,
      category,
      amount,
      currency,
      status,
      date,
      paidByUid,
      payeeUid,
      notes,
      createdByUid,
    } = body

    if (!type || !category || amount == null || !date || !createdByUid) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    await connectToDatabase()

    const record = await FinanceRecord.create({
      type,
      eventId,
      eventName,
      category,
      amount,
      currency: currency || 'INR',
      status: status || 'PENDING',
      date: new Date(date),
      paidByUid: paidByUid || null,
      payeeUid: payeeUid || null,
      notes: notes || null,
      createdByUid,
      updatedByUid: createdByUid,
    })

    return NextResponse.json({ record })
  } catch (err: any) {
    console.error('finance record create error', err?.message ?? err)
    return NextResponse.json(
      { error: 'Failed to create finance record' },
      { status: 500 },
    )
  }
}
