// lib/db/models/Event.ts
import mongoose, { Schema, type Model, type Document } from 'mongoose'

export type EventType = 'INTRA_SECMUN' | 'INTER_SECMUN' | 'WORKSHOP' | 'EDBLAZON_TIMES'

export type EventStatus = 'PLANNING' | 'REG_OPEN' | 'RUNNING' | 'COMPLETED' | 'ARCHIVED'

export interface EventDoc extends Document {
  name: string
  code: string
  type: EventType
  startDate: Date
  endDate: Date
  venue: string
  owningOffice: string
  status: EventStatus
  activeCommitteeIds: mongoose.Types.ObjectId[]
  registrationDeadline?: Date
  paymentConfig?: {
    enabled: boolean
    amount?: number
    currency?: string
    gpayQrUrl?: string
    notes?: string
  }
  createdAt: Date
  updatedAt: Date
}

const EventSchema = new Schema<EventDoc>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ['INTRA_SECMUN', 'INTER_SECMUN', 'WORKSHOP', 'EDBLAZON_TIMES'],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    venue: { type: String, required: true },
    owningOffice: { type: String, required: true },
    status: {
      type: String,
      enum: ['PLANNING', 'REG_OPEN', 'RUNNING', 'COMPLETED', 'ARCHIVED'],
      default: 'PLANNING',
    },
    activeCommitteeIds: [{ type: Schema.Types.ObjectId, ref: 'Committee' }],
    registrationDeadline: { type: Date },
    paymentConfig: {
      enabled: { type: Boolean, default: false },
      amount: { type: Number },
      currency: { type: String, default: 'INR' },
      gpayQrUrl: { type: String },
      notes: { type: String },
    },
  },
  { timestamps: true }
)

EventSchema.index({ type: 1, status: 1 })

export const Event: Model<EventDoc> =
  mongoose.models.Event || mongoose.model<EventDoc>('Event', EventSchema)
