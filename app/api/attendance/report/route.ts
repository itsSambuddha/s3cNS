// app/api/attendance/report/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { AttendanceRecord } from '@/lib/db/models/AttendanceRecord'
import { PlannedSession } from '@/lib/db/models/PlannedSession'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'

export async function GET(req: Request) {
  await connectToDatabase()
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const monthParam = searchParams.get('month') // 1–12 optional
  const yearParam = searchParams.get('year')

  const now = new Date()
  const month = monthParam ? Number(monthParam) - 1 : now.getMonth()
  const year = yearParam ? Number(yearParam) : now.getFullYear()

  const monthStart = new Date(year, month, 1)
  const monthEnd = new Date(year, month + 1, 1)

  const sessions = await PlannedSession.find({
    date: { $gte: monthStart, $lt: monthEnd },
  })
    .select('_id date subject slotLabel startTime endTime')
    .lean()
    .exec()

  const sessionIds = sessions.map((s) => s._id)

  const records = await AttendanceRecord.find({
    sessionId: { $in: sessionIds },
    studentId: user._id,
  })
    .select('sessionId status')
    .lean()
    .exec()

  const recordMap = new Map(
    records.map((r: any) => [String(r.sessionId), r.status])
  )

  const rows = sessions.map((s: any) => ({
    date: new Date(s.date).toISOString().slice(0, 10),
    subject: s.subject,
    slot: s.slotLabel ?? 'Class',
    time: `${s.startTime}–${s.endTime}`,
    status: recordMap.get(String(s._id)) || 'NOT_LOGGED',
  }))

  return NextResponse.json({
    month: month + 1,
    year,
    rows,
  })
}
