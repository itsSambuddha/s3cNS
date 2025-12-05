// app/api/attendance/today/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'

import { IPlannedSession, PlannedSession } from '@/lib/db/models/PlannedSession'
import { AttendanceRecord } from '@/lib/db/models/AttendanceRecord'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { generateSessionsForDate } from '@/lib/attendance/generateSessionsForDate'

function dayRange(d: Date) {
  const start = new Date(d)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(end.getDate() + 1)
  return { start, end }
}

export async function GET() {
  await connectToDatabase()
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date()
  await generateSessionsForDate(today, user)  // ensure sessions exist

  const { start, end } = dayRange(today)

  if (!user.classId) {
    return NextResponse.json({ sessions: [] })
  }

  // All sessions today (later you can filter by class if needed)
  const sessions = await PlannedSession.find({
    date: { $gte: start, $lt: end },
    classId: user.classId,
  })
    .lean()
    .exec()

  const ids = sessions.map((s) => s._id)

  // Current student's records for those sessions
  const records = await AttendanceRecord.find({
    sessionId: { $in: ids },
    studentId: user._id,
  })
    .select('sessionId status')
    .lean()
    .exec()

  const statusMap = new Map(
    records.map((r: any) => [String(r.sessionId), r.status])
  )

  const result = sessions.map((s: any) => ({
    _id: String(s._id),
    date: s.date,
    subject: s.subject,
    classId: s.classId,
    slotLabel: s.slotLabel ?? 'Class',
    startTime: s.startTime,
    endTime: s.endTime,
    status:
      (statusMap.get(String(s._id)) as
        | 'PRESENT'
        | 'ABSENT'
        | 'LATE'
        | 'EXCUSED'
        | undefined) || null,
  }))

  return NextResponse.json({ sessions: result })
}
