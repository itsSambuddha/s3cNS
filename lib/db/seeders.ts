// lib/db/seeders.ts (example snippet)
import { connectToDatabase } from '@/lib/db/connect'
import { Class } from '@/lib/db/models/Class'
import { Routine } from '@/lib/db/models/Routine'

export async function seedRoutine() {
  await connectToDatabase()

  const cls = await Class.findOneAndUpdate(
    { code: 'TY-BA-IR-A' },
    { name: 'TY B.A. IR A', code: 'TY-BA-IR-A', year: 2025 },
    { upsert: true, new: true }
  )

  await Routine.create([
    {
      classId: cls._id,
      dayOfWeek: 5,        // Friday
      slotLabel: 'Class 1',
      startTime: '08:00',
      endTime: '08:30',
      subject: 'Political Theory',
    },
    {
      classId: cls._id,
      dayOfWeek: 5,
      slotLabel: 'Class 2',
      startTime: '08:30',
      endTime: '09:00',
      subject: 'IR Seminar',
    },
  ])
}