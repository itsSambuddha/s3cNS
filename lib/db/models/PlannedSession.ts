// lib/db/models/PlannedSession.ts
import mongoose, { Schema, Document, Model } from 'mongoose'
import { Routine } from './Routine'
import { IClass } from './Class'

export interface IPlannedSession extends Document {
  date: Date
  routineId: mongoose.Types.ObjectId
  classId: mongoose.Types.ObjectId
  subject: string
  slotLabel: string
  startTime: string
  endTime: string
  status: 'OPEN' | 'LOCKED' | 'CANCELLED'
  createdBy: mongoose.Types.ObjectId
  lockedBy?: mongoose.Types.ObjectId
  lockedAt?: Date
}

const PlannedSessionSchema = new Schema<IPlannedSession>(
  {
    date: { type: Date, required: true },
    routineId: { type: Schema.Types.ObjectId, ref: 'Routine', required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    subject: { type: String, required: true },
    slotLabel: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: {
      type: String,
      enum: ['OPEN', 'LOCKED', 'CANCELLED'],
      default: 'OPEN',
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lockedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    lockedAt: { type: Date },
  },
  { timestamps: true }
)

PlannedSessionSchema.index({ date: 1, classId: 1 })

export const PlannedSession: Model<IPlannedSession> =
  mongoose.models.PlannedSession ||
  mongoose.model<IPlannedSession>('PlannedSession', PlannedSessionSchema)
