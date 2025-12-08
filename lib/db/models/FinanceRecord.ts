// lib/db/models/FinanceRecord.ts
import mongoose, { Schema, type Document, type Model } from 'mongoose'

export type FinanceRecordType =
  | 'BUDGET'
  | 'EXPENSE'
  | 'REIMBURSEMENT'
  | 'DUE'

export type FinanceCategory =
  | 'LOGISTICS'
  | 'PRINTING'
  | 'HOSPITALITY'
  | 'TECH'
  | 'MARKETING'
  | 'TRAVEL'
  | 'MISC'

export type FinanceStatus =
  | 'PLANNED'        // for budgets
  | 'PENDING'        // pending approval / payment
  | 'APPROVED'
  | 'PAID'
  | 'REJECTED'
  | 'OVERDUE'

export interface IFinanceRecord extends Document {
  type: FinanceRecordType
  eventId?: string | null
  eventName?: string | null
  category: FinanceCategory
  amount: number
  currency: string // e.g. 'INR'
  status: FinanceStatus
  date: Date

  paidByUid?: string | null   // who paid (for expenses/reimbursements)
  payeeUid?: string | null    // who receives (for reimbursements/dues)

  notes?: string | null

  createdByUid: string
  updatedByUid?: string | null

  createdAt: Date
  updatedAt: Date
}

const FinanceRecordSchema = new Schema<IFinanceRecord>(
  {
    type: {
      type: String,
      enum: ['BUDGET', 'EXPENSE', 'REIMBURSEMENT', 'DUE'],
      required: true,
    },
    eventId: { type: String, default: null },
    eventName: { type: String, default: null },

    category: {
      type: String,
      enum: [
        'LOGISTICS',
        'PRINTING',
        'HOSPITALITY',
        'TECH',
        'MARKETING',
        'TRAVEL',
        'MISC',
      ],
      required: true,
    },

    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },

    status: {
      type: String,
      enum: ['PLANNED', 'PENDING', 'APPROVED', 'PAID', 'REJECTED', 'OVERDUE'],
      default: 'PENDING',
    },

    date: { type: Date, required: true },

    paidByUid: { type: String, default: null },
    payeeUid: { type: String, default: null },

    notes: { type: String, default: null },

    createdByUid: { type: String, required: true },
    updatedByUid: { type: String, default: null },
  },
  { timestamps: true },
)

FinanceRecordSchema.index({ type: 1, eventId: 1 })
FinanceRecordSchema.index({ date: -1 })

export const FinanceRecord: Model<IFinanceRecord> =
  mongoose.models.FinanceRecord ||
  mongoose.model<IFinanceRecord>('FinanceRecord', FinanceRecordSchema)
