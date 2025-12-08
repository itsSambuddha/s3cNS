// lib/db/models/FinanceProposal.ts
import mongoose, { Schema, type Document, type Model } from 'mongoose'

export type ProposalStatus = 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED'

export interface IProposalLineItem {
  label: string
  category: string
  amount: number
}

export interface IProposalSection {
  heading: string
  body: string
}

export interface IFinanceProposal extends Document {
  title: string
  eventId?: string | null
  eventName?: string | null
  status: ProposalStatus
  lineItems: IProposalLineItem[]
  sections: IProposalSection[]
  attachments: string[]
  toEmails: string[]
  createdByUid: string
  updatedByUid?: string | null
  createdAt: Date
  updatedAt: Date
}

const LineItemSchema = new Schema<IProposalLineItem>(
  {
    label: { type: String, required: true },
    category: { type: String, default: 'MISC' },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false },
)

const SectionSchema = new Schema<IProposalSection>(
  {
    heading: { type: String, required: true },
    body: { type: String, required: true },
  },
  { _id: false },
)

const FinanceProposalSchema = new Schema<IFinanceProposal>(
  {
    title: { type: String, required: true },
    eventId: { type: String, default: null },
    eventName: { type: String, default: null },
    status: {
      type: String,
      enum: ['DRAFT', 'SENT', 'APPROVED', 'REJECTED'],
      default: 'DRAFT',
    },
    lineItems: { type: [LineItemSchema], default: [] },
    sections: { type: [SectionSchema], default: [] },
    attachments: { type: [String], default: [] },
    toEmails: { type: [String], default: [] },
    createdByUid: { type: String, required: true },
    updatedByUid: { type: String, default: null },
  },
  { timestamps: true },
)

FinanceProposalSchema.index({ eventId: 1 })
FinanceProposalSchema.index({ status: 1 })

export const FinanceProposal: Model<IFinanceProposal> =
  mongoose.models.FinanceProposal ||
  mongoose.model<IFinanceProposal>('FinanceProposal', FinanceProposalSchema)
