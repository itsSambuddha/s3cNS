// lib/db/models/Channel.ts
import mongoose, { Schema, type Model, type Document } from 'mongoose'
import { type SecretariatRole } from './User'

// We include DIRECT for legacy support if needed, but DM is our preferred type.
export type ChannelType = 'GROUP' | 'DM' | 'DIRECT'

export interface IChannel extends Document {
  name: string
  description?: string
  type: ChannelType
  allowedRoles: SecretariatRole[]
  participants?: string[] // For direct messages or specific invites
  lastMessage?: {
    content: string
    senderName: string
    senderId: string
    createdAt: Date
  }
  createdAt: Date
  updatedAt: Date
}

const ChannelSchema = new Schema<IChannel>(
  {
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['GROUP', 'DM', 'DIRECT'], default: 'GROUP' },
    allowedRoles: { type: [String], default: [] },
    participants: { type: [String], default: [] },
    lastMessage: {
      content: { type: String },
      senderName: { type: String },
      senderId: { type: String },
      createdAt: { type: Date },
    },
  },
  { timestamps: true }
)

// Index for role-based filtering and DM participant lookups
ChannelSchema.index({ allowedRoles: 1 })
ChannelSchema.index({ participants: 1 })

// Clear model cache to force re-evaluation of enum
if (mongoose.models.Channel) {
  delete (mongoose.models as any).Channel
}

export const Channel: Model<IChannel> = mongoose.model<IChannel>('Channel', ChannelSchema)
