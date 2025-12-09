// app/api/finance/records/[id]/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { FinanceRecord } from '@/lib/db/models/FinanceRecord'
import type { FinanceStatus } from '@/lib/db/models/FinanceRecord'

type RouteParams = { params: { id: string } }

// UPDATE one record (amount, status, eventName, date, notes, etc.)
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const id = params.id
    const body = await req.json()

    const {
      eventName,
      category,
      amount,
      currency,
      status,
      date,
      notes,
      paidByUid,
      payeeUid,
      updatedByUid,
    } = body

    if (!updatedByUid) {
      return NextResponse.json(
        { error: 'updatedByUid is required' },
        { status: 400 },
      )
    }

    await connectToDatabase()

    const update: Record<string, any> = { updatedByUid }

    if (eventName !== undefined) update.eventName = eventName || null
    if (category !== undefined) update.category = category
    if (amount !== undefined) update.amount = amount
    if (currency !== undefined) update.currency = currency
    if (status !== undefined) update.status = status as FinanceStatus
    if (date !== undefined) update.date = new Date(date)
    if (notes !== undefined) update.notes = notes || null
    if (paidByUid !== undefined) update.paidByUid = paidByUid || null
    if (payeeUid !== undefined) update.payeeUid = payeeUid || null

    const record = await FinanceRecord.findByIdAndUpdate(id, update, {
      new: true,
    }).lean()

    if (!record) {
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({ record })
  } catch (err: any) {
    console.error('finance record update error', err?.message ?? err)
    return NextResponse.json(
      { error: 'Failed to update record' },
      { status: 500 },
    )
  }
}

// HARD DELETE one record
export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const id = params.id
    await connectToDatabase()

    const result = await FinanceRecord.findByIdAndDelete(id)

    if (!result) {
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('finance record delete error', err?.message ?? err)
    return NextResponse.json(
      { error: 'Failed to delete record' },
      { status: 500 },
    )
  }
}
