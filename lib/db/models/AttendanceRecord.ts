// lib/db/models/AttendanceRecord.ts
import mongoose, { Schema, Document, Model } from 'mongoose'
import { IPlannedSession } from './PlannedSession'

export interface IAttendanceRecord extends Document {
  sessionId: IPlannedSession['_id']
  studentId: mongoose.Types.ObjectId
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
  markedBy: mongoose.Types.ObjectId
  markedAt: Date
  note?: string
}

const AttendanceRecordSchema = new Schema<IAttendanceRecord>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'PlannedSession',
      required: true,
    },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'],
      required: true,
    },
    markedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    markedAt: { type: Date, default: Date.now },
    note: { type: String },
  },
  { timestamps: true }
)

// prevent duplicates
AttendanceRecordSchema.index({ sessionId: 1, studentId: 1 }, { unique: true })

export const AttendanceRecord: Model<IAttendanceRecord> =
  mongoose.models.AttendanceRecord ||
  mongoose.model<IAttendanceRecord>('AttendanceRecord', AttendanceRecordSchema)
