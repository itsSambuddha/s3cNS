// lib/db/models/OutboundConference.ts
import mongoose, { Schema, type Document, type Model } from 'mongoose'

export type DelegateAward =
  | 'BEST_DELEGATE'
  | 'HIGH_COMMENDATION'
  | 'SPECIAL_MENTION'
  | 'VERBAL_MENTION'
  | null

export type DelegateStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface OutboundDelegate {
  _id?: mongoose.Types.ObjectId
  fullName: string
  semester: string
  dept: string
  experience: string
  rollNo: string
  attendance: number // percentage
  contactNo: string
  committeeChoice: string
  committeeReceived: string
  portfolioReceived: string
  paid: boolean
  status: DelegateStatus
  award: DelegateAward
  doubleDelegateId?: string
  attendanceDays: Record<string, 'PRESENT' | 'ABSENT'>
}

export interface OutboundConferenceDoc extends Document {
  name: string
  venue: string
  dates: string[] // e.g. ["2026-04-10","2026-04-11"]
  delegates: OutboundDelegate[]
  teamAward: string // e.g. "Best Delegation" or custom
  teamPhotoUrl: string
  photoContactName: string
  photoContactNo: string
  createdBy: string // uid
  createdAt: Date
  updatedAt: Date
}

const OutboundDelegateSchema = new Schema<OutboundDelegate>(
  {
    fullName: { type: String, required: true, trim: true },
    semester: { type: String, default: '' },
    dept: { type: String, default: '' },
    experience: { type: String, default: '' },
    rollNo: { type: String, default: '' },
    attendance: { type: Number, default: 0 },
    contactNo: { type: String, default: '' },
    committeeChoice: { type: String, default: '' },
    committeeReceived: { type: String, default: '' },
    portfolioReceived: { type: String, default: '' },
    paid: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    award: {
      type: String,
      enum: ['BEST_DELEGATE', 'HIGH_COMMENDATION', 'SPECIAL_MENTION', 'VERBAL_MENTION', null],
      default: null,
    },
    doubleDelegateId: { type: String, default: null },
    attendanceDays: { type: Map, of: String, default: {} },
  },
  { _id: true }
)

const OutboundConferenceSchema = new Schema<OutboundConferenceDoc>(
  {
    name: { type: String, required: true, trim: true },
    venue: { type: String, default: '' },
    dates: [{ type: String }],
    delegates: [OutboundDelegateSchema],
    teamAward: { type: String, default: '' },
    teamPhotoUrl: { type: String, default: '' },
    photoContactName: { type: String, default: '' },
    photoContactNo: { type: String, default: '' },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
)

// Force refresh model if schema changed
if (mongoose.models.OutboundConference) {
  delete mongoose.models.OutboundConference
}

export const OutboundConference: Model<OutboundConferenceDoc> =
  mongoose.models.OutboundConference ||
  mongoose.model<OutboundConferenceDoc>('OutboundConference', OutboundConferenceSchema)
