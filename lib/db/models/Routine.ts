// lib/db/models/Routine.ts
import mongoose, { Schema, Document, Model } from 'mongoose'
import { IClass } from './Class'

export interface IRoutine extends Document {
  classId: mongoose.Types.ObjectId       // which college class/section
  dayOfWeek: number                      // 0 = Sun ... 6 = Sat
  slotLabel: string                      // "Class 1"
  startTime: string                      // "08:00"
  endTime: string                        // "08:30"
  subject: string
  isActive: boolean
}

const RoutineSchema = new Schema<IRoutine>(
  {
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    slotLabel: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    subject: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

RoutineSchema.index({ classId: 1, dayOfWeek: 1 })

export const Routine: Model<IRoutine> =
  mongoose.models.Routine || mongoose.model<IRoutine>('Routine', RoutineSchema)
