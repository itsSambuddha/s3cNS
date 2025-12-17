// lib/db/models/DelegateRegistration.ts


import mongoose, { Schema, type Document, type Model } from "mongoose"
import { EventType } from "./Event"

export type InterestType = "DELEGATE" | "CAMPUS_AMBASSADOR"
export type DelegateStatus = "APPLIED" | "ALLOTTED" | "REJECTED" | "WITHDRAWN"

export interface DelegateRegistrationDoc extends Document {
  eventId?: mongoose.Types.ObjectId
  eventType: EventType

  fullName: string
  email: string
  whatsAppNumber: string

  interestType?: InterestType

  /* Interest communication */
  emailSent: boolean
  whatsappSent: boolean

  /* Registration communication */
  registrationEmailSent: boolean
  registrationWhatsappSent: boolean

  status: DelegateStatus
  createdAt: Date
  updatedAt: Date
}

const DelegateRegistrationSchema = new Schema<DelegateRegistrationDoc>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      index: true,
    },

    eventType: {
      type: String,
      enum: ["INTRA_SECMUN", "INTER_SECMUN", "WORKSHOP", "EDBLAZON_TIMES"],
      required: true,
      index: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    whatsAppNumber: {
      type: String,
      required: true,
      trim: true,
    },

    interestType: {
      type: String,
      enum: ["DELEGATE", "CAMPUS_AMBASSADOR"],
    },

    emailSent: {
      type: Boolean,
      default: false,
    },

    whatsappSent: {
      type: Boolean,
      default: false,
    },

    registrationEmailSent: {
      type: Boolean,
      default: false,
    },

    registrationWhatsappSent: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["APPLIED", "ALLOTTED", "REJECTED", "WITHDRAWN"],
      default: "APPLIED",
    },
  },
  { timestamps: true },
)

/* ===== FORCE RESET FOR NEXT DEV ===== */
const MODEL = "DelegateRegistration"
if (mongoose.models[MODEL]) delete mongoose.models[MODEL]

export const DelegateRegistration: Model<DelegateRegistrationDoc> =
  mongoose.model(MODEL, DelegateRegistrationSchema)
