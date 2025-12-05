import mongoose from 'mongoose' // Import mongoose
import { connectToDatabase } from '@/lib/db/connect'
import { Routine } from '@/lib/db/models/Routine'
import { PlannedSession } from '@/lib/db/models/PlannedSession'
import { IUser } from '@/lib/db/models/User' // Import IUser

export async function generateSessionsForDate(date: Date, user?: IUser) {
  await connectToDatabase()

  const dayOfWeek = date.getDay()
  const dayStart = new Date(date)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(dayStart)
  dayEnd.setDate(dayEnd.getDate() + 1)

  if (user && user.routine && user.routine.length > 0) {
    // Generate sessions from user's personal routine
    for (const r of user.routine) {
      if (!user.classId) {
        console.warn(`User ${user._id} has a personal routine but no classId. Skipping session generation for this routine item.`)
        continue;
      }
      
      const existing = await PlannedSession.findOne({
        date: dayStart,
        createdBy: user._id, // Sessions created from personal routine are tied to the user
        subject: r.className,
        startTime: r.startTime,
        endTime: r.endTime,
      }).lean();

      if (existing) continue;

      await PlannedSession.create({
        date: dayStart,
        // NOTE: PlannedSession.routineId is a required ref to 'Routine'.
        // For user-specific routines, we're generating a new ObjectId.
        // This means these sessions are not directly linked to a global Routine document.
        // A more robust solution might involve altering the PlannedSession schema
        // to handle user-specific routines without a global 'Routine' reference,
        // or creating dummy Routine entries for each user's routine item.
        routineId: new mongoose.Types.ObjectId(), // Placeholder for user-specific routine
        classId: user.classId,
        subject: r.className,
        slotLabel: r.className, // Using className as slotLabel
        startTime: r.startTime,
        endTime: r.endTime,
        status: 'OPEN',
        createdBy: user._id,
      });
    }
  } else {
    // Existing logic: Generate sessions from global Routine model
    const routines = await Routine.find({
      dayOfWeek,
      isActive: true,
    })
      .lean()
      .exec()

    if (!routines.length) return

    for (const r of routines) {
      const existing = await PlannedSession.findOne({
        date: { $gte: dayStart, $lt: dayEnd },
        routineId: r._id,
      }).lean()

      if (existing) continue

      await PlannedSession.create({
        date: dayStart,
        routineId: r._id,
        classId: r.classId,
        subject: r.subject,
        slotLabel: r.slotLabel,
        startTime: r.startTime,
        endTime: r.endTime,
        status: 'OPEN',
        createdBy: r.classId, // or some admin/teacher id; you can adjust later
      })
    }
  }
}
