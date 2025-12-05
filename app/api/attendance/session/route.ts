// // app/api/attendance/session/route.ts
// import { NextResponse } from 'next/server'
// import { connectToDatabase } from '@/lib/db/connect'
// import { PlannedSessionModel } from '@/lib/db/models/PlannedSession'
// import { AttendanceRecordModel } from '@/lib/db/models/AttendanceRecord'
// import { User } from '@/lib/db/models'
// import { getCurrentUser } from '@/lib/auth/getCurrentUser'

// export async function GET(req: Request) {
//   await connectToDatabase()
//   const user = await getCurrentUser()
//   if (!user) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//   }

//   const { searchParams } = new URL(req.url)
//   const sessionId = searchParams.get('id')
//   if (!sessionId) {
//     return NextResponse.json({ error: 'Missing id' }, { status: 400 })
//   }

//   const session = await PlannedSessionModel.findById(sessionId).lean()
//   if (!session) {
//     return NextResponse.json({ error: 'Session not found' }, { status: 404 })
//   }

//   // basic permission (only creator/faculty)
//   if (String(session.createdBy) !== String(user._id)) {
//     return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
//   }

//   const studentIds = session.expectedStudentIds || []
//   const students = await User.find({ _id: { $in: studentIds } })
//     .select('_id name')
//     .lean()

//   const records = await AttendanceRecordModel.find({
//     sessionId,
//     studentId: { $in: studentIds },
//   })
//     .select('studentId status')
//     .lean()

//   const recordMap = new Map(
//     records.map((r: any) => [String(r.studentId), r.status])
//   )

//   const result = students.map((s: any) => ({
//     _id: String(s._id),
//     name: s.name || s.displayName || s.email,
//     status: recordMap.get(String(s._id)) || 'ABSENT',
//   }))

//   return NextResponse.json({ students: result })
// }
