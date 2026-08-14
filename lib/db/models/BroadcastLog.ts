import mongoose, { Schema, type Model, type Document } from 'mongoose'

export interface IBroadcastLog extends Document {
  title: string
  body: string
  url?: string
  category: string
  targetAudience: string
  targetValue?: string
  recipientCount: number
  sentBy: string
  isDeveloperOverride: boolean
  createdAt: Date
}

const BroadcastLogSchema = new Schema<IBroadcastLog>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    url: { type: String, default: '/dashboard' },
    category: { type: String, default: 'ANNOUNCEMENT' },
    targetAudience: { type: String, required: true },
    targetValue: { type: String, default: 'ALL' },
    recipientCount: { type: Number, default: 0 },
    sentBy: { type: String, default: 'Developer / System' },
    isDeveloperOverride: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const BroadcastLog: Model<IBroadcastLog> =
  mongoose.models.BroadcastLog ||
  mongoose.model<IBroadcastLog>('BroadcastLog', BroadcastLogSchema)
