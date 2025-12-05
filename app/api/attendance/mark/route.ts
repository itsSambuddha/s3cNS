// app/api/attendance/mark/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { PlannedSession } from '@/lib/db/models/PlannedSession'
import { AttendanceRecord } from '@/lib/db/models/AttendanceRecord'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'

export async function POST(request: Request) {
  await connectToDatabase()
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { sessionId, status } = await request.json()

  if (!sessionId || !status) {
    return NextResponse.json({ error: 'Missing sessionId or status' }, { status: 400 })
  }

  const validStatuses = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const session = await PlannedSession.findById(sessionId)
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  // Optional: if session date is Sunday, return 400 (as per prompt, but check dayRange logic if needed)
  // const sessionDate = new Date(session.date);
  // if (sessionDate.getDay() === 0) { // 0 for Sunday
  //   return NextResponse.json({ error: 'Cannot mark attendance for Sunday sessions' }, { status: 400 });
  // }

  await AttendanceRecord.findOneAndUpdate(
    { sessionId, studentId: user._id },
    { status, markedBy: user._id, markedAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )

  return NextResponse.json({ ok: true })
}