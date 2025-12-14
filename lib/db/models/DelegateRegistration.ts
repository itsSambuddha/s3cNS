// lib/db/models/DelegateRegistration.ts
import mongoose, { Schema, type Model, type Document } from 'mongoose'
import { EventType } from './Event'

export type DelegateStatus = 'APPLIED' | 'ALLOTTED' | 'REJECTED' | 'WITHDRAWN'

export type FromSec = 'INSIDE_SEC' | 'OUTSIDE_SEC'

export type InstituteType = 'COLLEGE' | 'SCHOOL'

export type WorkshopInterest = 'JOURNALIST' | 'VIDEO_JOURNALIST'

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

export interface DelegateRegistrationDoc extends Document {
  eventId: mongoose.Types.ObjectId
  eventType: EventType
  fullName: string
  email: string
  whatsAppNumber: string
  fromSec: FromSec
  insideSecInfo?: InsideSecInfo
  outsideSecInfo?: OutsideSecInfo
  pastExperience: string
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

const DelegateRegistrationSchema = new Schema<DelegateRegistrationDoc>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    eventType: {
      type: String,
      enum: ['INTRA_SECMUN', 'INTER_SECMUN', 'WORKSHOP', 'EDBLAZON_TIMES'],
      required: true,
      index: true,
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true, index: true },
    whatsAppNumber: { type: String, required: true },
    fromSec: {
      type: String,
      enum: ['INSIDE_SEC', 'OUTSIDE_SEC'],
      required: true,
      index: true,
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
        enum: ['COLLEGE', 'SCHOOL'],
      },
      collegeName: { type: String },
      schoolName: { type: String },
      semester: { type: String },
      class: { type: String },
      idDocumentUrl: { type: String },
    },
    pastExperience: { type: String, required: true },
    committeePref1: { type: Schema.Types.ObjectId, ref: 'Committee' },
    committeePref2: { type: Schema.Types.ObjectId, ref: 'Committee' },
    committeePref3: { type: Schema.Types.ObjectId, ref: 'Committee' },
    interestRole: {
      type: String,
      enum: ['JOURNALIST', 'VIDEO_JOURNALIST'],
    },
    status: {
      type: String,
      enum: ['APPLIED', 'ALLOTTED', 'REJECTED', 'WITHDRAWN'],
      default: 'APPLIED',
      index: true,
    },
    portfolioId: { type: Schema.Types.ObjectId, ref: 'Portfolio' },
    delegateCode: { type: String },
    paymentClaimed: { type: Boolean },
    paymentRef: { type: String },
  },
  { timestamps: true }
)

DelegateRegistrationSchema.index({ eventId: 1, status: 1 })
DelegateRegistrationSchema.index({ eventId: 1, email: 1 })

export const DelegateRegistration: Model<DelegateRegistrationDoc> =
  mongoose.models.DelegateRegistration || mongoose.model<DelegateRegistrationDoc>('DelegateRegistration', DelegateRegistrationSchema)
