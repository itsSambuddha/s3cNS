// lib/db/models/Event.ts
// FULLY REPLACEABLE — supports DA Overview + Registration flow

import mongoose, { Schema, type Model, type Document } from "mongoose"

export type EventType =
  | "INTRA_SECMUN"
  | "INTER_SECMUN"
  | "WORKSHOP"
  | "EDBLAZON_TIMES"

export type EventStatus = "REG_OPEN" | "REG_CLOSED"

export interface EventDoc extends Document {
  name: string
  type: EventType
  status: EventStatus

  registrationDeadline?: Date | null

  // DA Overview additions
  delegateFormLink?: string
  ambassadorFormLink?: string

  createdAt: Date
  updatedAt: Date
}

const EventSchema = new Schema<EventDoc>(
  {
    name: { type: String, required: true },

    type: {
      type: String,
      enum: [
        "INTRA_SECMUN",
        "INTER_SECMUN",
        "WORKSHOP",
        "EDBLAZON_TIMES",
      ],
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["REG_OPEN", "REG_CLOSED"],
      default: "REG_CLOSED",
      index: true,
    },

    registrationDeadline: {
      type: Date,
    },

    // ===== DA Overview fields =====
    delegateFormLink: {
      type: String,
    },

    ambassadorFormLink: {
      type: String,
    },
  },
  { timestamps: true },
)

EventSchema.index({ type: 1, status: 1 })

export const Event: Model<EventDoc> =
  mongoose.models.Event ||
  mongoose.model<EventDoc>("Event", EventSchema)
