import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { BroadcastLog } from '@/lib/db/models/BroadcastLog'

export async function GET() {
  try {
    await connectToDatabase()

    const logs = await BroadcastLog.find({})
      .sort({ createdAt: -1 })
      .limit(30)
      .lean()

    return NextResponse.json({ success: true, logs })
  } catch (error: any) {
    console.error('Error fetching broadcast history:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch history' },
      { status: 500 }
    )
  }
}
