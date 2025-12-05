// lib/db/models/SelfAttendance.ts
import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISelfAttendance extends Document {
  userId: mongoose.Types.ObjectId
  date: Date           // date only (midnight)
  status: 'PRESENT' | 'ABSENT'
}

const SelfAttendanceSchema = new Schema<ISelfAttendance>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ['PRESENT', 'ABSENT'],
      required: true,
    },
  },
  { timestamps: true }
)

SelfAttendanceSchema.index(
  { userId: 1, date: 1 },
  { unique: true }
)

export const SelfAttendance: Model<ISelfAttendance> =
  mongoose.models.SelfAttendance ||
  mongoose.model<ISelfAttendance>('SelfAttendance', SelfAttendanceSchema)
