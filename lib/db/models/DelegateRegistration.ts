// lib/db/models/DelegateRegistration.ts
// FULLY REPLACEABLE — SAFE FOR NEXT.JS DEV (FORCES SCHEMA RESET)

import mongoose, { Schema, type Model, type Document } from "mongoose"
import { EventType } from "./Event"

/* =======================
   ENUMS
======================= */

export type DelegateStatus =
  | "APPLIED"
  | "ALLOTTED"
  | "REJECTED"
  | "WITHDRAWN"

export type InterestType = "DELEGATE" | "CAMPUS_AMBASSADOR"

export type FromSec = "INSIDE_SEC" | "OUTSIDE_SEC"

export type InstituteType = "COLLEGE" | "SCHOOL"

export type WorkshopInterest = "JOURNALIST" | "VIDEO_JOURNALIST"

/* =======================
   SUBDOCUMENT TYPES
======================= */

export interface InsideSecInfo {
  semester: string
  classRollNo: string
  department: string
  idDocumentUrl: string
}

export interface OutsideSecInfo {
  instituteType: InstituteType
  collegeName?: string
  schoolName?: string
  semester?: string
  class?: string
  idDocumentUrl: string
}

/* =======================
   DOCUMENT TYPE
======================= */

export interface DelegateRegistrationDoc extends Document {
  eventId?: mongoose.Types.ObjectId
  eventType: EventType

  fullName: string
  email: string
  whatsAppNumber: string

  interestType?: InterestType
  emailSent?: boolean
  whatsappSent?: boolean

  fromSec?: FromSec
  insideSecInfo?: InsideSecInfo
  outsideSecInfo?: OutsideSecInfo

  pastExperience?: string

  committeePref1?: mongoose.Types.ObjectId
  committeePref2?: mongoose.Types.ObjectId
  committeePref3?: mongoose.Types.ObjectId

  interestRole?: WorkshopInterest | null

  status: DelegateStatus

  portfolioId?: mongoose.Types.ObjectId | null
  delegateCode?: string

  paymentClaimed?: boolean
  paymentRef?: string

  createdAt: Date
  updatedAt: Date
}

/* =======================
   SCHEMA
======================= */

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
      lowercase: true,
      trim: true,
      index: true,
    },

    whatsAppNumber: {
      type: String,
      required: true,
      trim: true,
    },

    /* ===== Phase 1: Interest ===== */

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

    /* ===== Phase 2: Full Registration ===== */

    fromSec: {
      type: String,
      enum: ["INSIDE_SEC", "OUTSIDE_SEC"],
    },

    insideSecInfo: {
      semester: { type: String },
      classRollNo: { type: String },
      department: { type: String },
      idDocumentUrl: { type: String },
    },

    outsideSecInfo: {
      instituteType: {
        type: String,
        enum: ["COLLEGE", "SCHOOL"],
      },
      collegeName: { type: String },
      schoolName: { type: String },
      semester: { type: String },
      class: { type: String },
      idDocumentUrl: { type: String },
    },

    pastExperience: {
      type: String,
    },

    committeePref1: {
      type: Schema.Types.ObjectId,
      ref: "Committee",
    },

    committeePref2: {
      type: Schema.Types.ObjectId,
      ref: "Committee",
    },

    committeePref3: {
      type: Schema.Types.ObjectId,
      ref: "Committee",
    },

    interestRole: {
      type: String,
      enum: ["JOURNALIST", "VIDEO_JOURNALIST"],
    },

    status: {
      type: String,
      enum: ["APPLIED", "ALLOTTED", "REJECTED", "WITHDRAWN"],
      default: "APPLIED",
      index: true,
    },

    portfolioId: {
      type: Schema.Types.ObjectId,
      ref: "Portfolio",
    },

    delegateCode: {
      type: String,
    },

    paymentClaimed: {
      type: Boolean,
    },

    paymentRef: {
      type: String,
    },
  },
  { timestamps: true },
)

/* =======================
   INDEXES
======================= */

DelegateRegistrationSchema.index({ eventType: 1, status: 1 })
DelegateRegistrationSchema.index({ eventType: 1, email: 1 })
DelegateRegistrationSchema.index({ interestType: 1 })

/* =======================
   FORCE MODEL RESET
   (CRITICAL FOR NEXT.JS DEV)
======================= */

const MODEL_NAME = "DelegateRegistration"

if (mongoose.models[MODEL_NAME]) {
  delete mongoose.models[MODEL_NAME]
}

export const DelegateRegistration: Model<DelegateRegistrationDoc> =
  mongoose.model<DelegateRegistrationDoc>(
    MODEL_NAME,
    DelegateRegistrationSchema,
  )
