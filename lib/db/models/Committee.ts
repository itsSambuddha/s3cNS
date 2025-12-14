// lib/db/models/Committee.ts
import mongoose, { Schema, type Model, type Document } from 'mongoose'

export interface CommitteeDoc extends Document {
  eventId: mongoose.Types.ObjectId
  name: string
  code: string
  agenda?: string
  capacity?: number
  chairNames?: string[]
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  isIPC?: boolean
  createdAt: Date
  updatedAt: Date
}

const CommitteeSchema = new Schema<CommitteeDoc>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    agenda: { type: String },
    capacity: { type: Number },
    chairNames: [{ type: String }],
    level: {
      type: String,
      enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    },
    isIPC: { type: Boolean, default: false },
  },
  { timestamps: true }
)

CommitteeSchema.index({ eventId: 1, code: 1 }, { unique: true })

export const Committee: Model<CommitteeDoc> =
  mongoose.models.Committee || mongoose.model<CommitteeDoc>('Committee', CommitteeSchema)
