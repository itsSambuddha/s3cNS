// lib/db/models/Portfolio.ts
import mongoose, { Schema, type Model, type Document } from 'mongoose'

export type PortfolioType = 'COUNTRY' | 'ROLE'

export interface PortfolioDoc extends Document {
  eventId: mongoose.Types.ObjectId
  committeeId?: mongoose.Types.ObjectId | null
  label: string
  code: string
  type: PortfolioType
  isTaken: boolean
  assignedDelegateId?: mongoose.Types.ObjectId | null
  createdAt: Date
  updatedAt: Date
}

const PortfolioSchema = new Schema<PortfolioDoc>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    committeeId: { type: Schema.Types.ObjectId, ref: 'Committee', index: true },
    label: { type: String, required: true },
    code: { type: String, required: true },
    type: {
      type: String,
      enum: ['COUNTRY', 'ROLE'],
      required: true,
    },
    isTaken: { type: Boolean, default: false, index: true },
    assignedDelegateId: { type: Schema.Types.ObjectId, ref: 'DelegateRegistration' },
  },
  { timestamps: true }
)

PortfolioSchema.index({ eventId: 1, committeeId: 1, code: 1 }, { unique: true })

export const Portfolio: Model<PortfolioDoc> =
  mongoose.models.Portfolio || mongoose.model<PortfolioDoc>('Portfolio', PortfolioSchema)
