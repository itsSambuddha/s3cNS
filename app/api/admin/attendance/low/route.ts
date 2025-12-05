// app/api/admin/attendance/low/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { AttendanceRecord } from '@/lib/db/models/AttendanceRecord'
import { PlannedSession } from '@/lib/db/models/PlannedSession'
import { User } from '@/lib/db/models/User'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'

export async function GET() {
  await connectToDatabase()
  const current = await getCurrentUser()
  if (!current || current.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  const monthStart = new Date(year, month, 1)
  const monthEnd = new Date(year, month + 1, 1)

  const sessions = await PlannedSession.find({
    date: { $gte: monthStart, $lt: monthEnd },
  })
    .select('_id')
    .lean()
    .exec()

  const sessionIds = sessions.map((s) => s._id)
  if (!sessionIds.length) {
    return NextResponse.json({ month: month + 1, year, students: [] })
  }

  const records = await AttendanceRecord.find({
    sessionId: { $in: sessionIds },
  })
    .select('studentId status')
    .lean()
    .exec()

  // aggregate per student
  const stats = new Map<
    string,
    { present: number; total: number }
  >()

  for (const r of records as any[]) {
    const key = String(r.studentId)
    const entry = stats.get(key) ?? { present: 0, total: 0 }
    entry.total += 1
    if (r.status === 'PRESENT') entry.present += 1
    stats.set(key, entry)
  }

  const userIds = Array.from(stats.keys())
  const users = await User.find({ _id: { $in: userIds } })
    .select('_id email displayName role')
    .lean()
    .exec()

  const students = users
    .map((u: any) => {
      const s = stats.get(String(u._id))!
      const percentage =
        s.total > 0 ? Math.round((s.present / s.total) * 100) : 0
      return {
        id: String(u._id),
        name: u.displayName || u.email,
        email: u.email,
        role: u.role,
        present: s.present,
        total: s.total,
        percentage,
      }
    })
    .filter((x) => x.percentage < 80)

  return NextResponse.json({
    month: month + 1,
    year,
    students,
  })
}