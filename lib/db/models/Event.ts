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
}

const EventSchema = new Schema<EventDoc>(
  {
    name: { type: String, required: true },
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
    },
    registrationDeadline: {
      type: Date,
      default: null,
    },
    delegateFormLink: String,
    ambassadorFormLink: String,
  },
  { timestamps: true },
)

export const Event: Model<EventDoc> =
  mongoose.models.Event || mongoose.model("Event", EventSchema)
