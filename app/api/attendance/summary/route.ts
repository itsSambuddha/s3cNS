// app/api/attendance/summary/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { PlannedSession } from '@/lib/db/models/PlannedSession'
import { AttendanceRecord } from '@/lib/db/models/AttendanceRecord'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'

export async function GET(request: Request) {
  await connectToDatabase()
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const queryMonth = parseInt(searchParams.get('month') || '', 10)
  const queryYear = parseInt(searchParams.get('year') || '', 10)

  const now = new Date()
  const year = queryYear || now.getFullYear()
  const month = queryMonth ? queryMonth - 1 : now.getMonth() // month is 0-indexed for Date object

  const monthStart = new Date(year, month, 1)
  const monthEnd = new Date(year, month + 1, 1)

  // Get all planned sessions for the current month and user's class
  const sessions = await PlannedSession.find({
    date: { $gte: monthStart, $lt: monthEnd },
    classId: user.classId, // Filter by user's classId
  })
    .select('_id')
    .lean()
    .exec()

  const sessionIds = sessions.map((s) => s._id)
  const totalSessions = sessionIds.length

  if (!totalSessions) {
    return NextResponse.json({
      month: month + 1,
      year,
      totalSessions: 0,
      present: 0,
      percentage: 0,
      belowEighty: false,
    })
  }

  // Get attendance records for the current user for these sessions
  const records = await AttendanceRecord.find({
    sessionId: { $in: sessionIds },
    studentId: user._id,
    status: 'PRESENT', // Only count present records
  })
    .select('status')
    .lean()
    .exec()

  const present = records.length
  const percentage = Math.round((present / totalSessions) * 100)

  return NextResponse.json({
    month: month + 1, // Convert back to 1-indexed for output
    year,
    totalSessions,
    present,
    percentage,
    belowEighty: percentage < 80,
  })
}