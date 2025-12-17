// lib/db/models/Event.ts

import mongoose, { Schema, type Document, type Model } from "mongoose"

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
  delegateFormLink?: string
  ambassadorFormLink?: string
  createdAt: Date
  updatedAt: Date
}

const EventSchema = new Schema<EventDoc>(
  {
    name: { type: String, required: true, trim: true },

    type: {
      type: String,
      enum: ["INTRA_SECMUN", "INTER_SECMUN", "WORKSHOP", "EDBLAZON_TIMES"],
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
      default: null,
    },

    // Per‑event links used in OverviewTab and registration communications
    delegateFormLink: {
      type: String,
      default: null,
    },

    ambassadorFormLink: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

export const Event: Model<EventDoc> =
  mongoose.models.Event || mongoose.model<EventDoc>("Event", EventSchema)
