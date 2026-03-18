// lib/db/models/Message.ts
import mongoose, { Schema, type Model, type Document } from 'mongoose'

export interface IAttachment {
  url: string
  name: string
  type: string
  size?: number
}

export interface IMessage extends Document {
  channelId: mongoose.Types.ObjectId
  senderId: string // Firebase UID
  senderName: string
  senderAvatar?: string
  content: string
  attachments?: IAttachment[]
  edited?: boolean
  deleted?: boolean
  readBy: {
    userId: string
    at: Date
  }[]
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    channelId: { type: Schema.Types.ObjectId, ref: 'Channel', required: true, index: true },
    senderId: { type: String, required: true, index: true },
    senderName: { type: String, required: true },
    senderAvatar: { type: String },
    content: { type: String, required: true },
    attachments: [
      {
        url: { type: String, required: true },
        name: { type: String, required: true },
        type: { type: String, required: true },
        size: { type: Number },
      },
    ],
    edited: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    readBy: [{
      userId: { type: String, required: true },
      at: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
)

// Index for fetching messages in a channel ordered by time
MessageSchema.index({ channelId: 1, createdAt: -1 })

export const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema)
