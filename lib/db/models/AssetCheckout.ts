// lib/db/models/AssetCheckout.ts
import mongoose, { Schema, type Document, type Model } from 'mongoose'

export type AssetCheckoutStatus = 'OUT' | 'RETURNED' | 'LOST' | 'DAMAGED'

export interface IAssetCheckout extends Document {
  assetId: mongoose.Types.ObjectId
  memberUid: string
  eventId?: string | null
  eventName?: string | null
  quantity: number
  checkedOutAt: Date
  dueBackAt?: Date | null
  returnedAt?: Date | null
  status: AssetCheckoutStatus
  notes?: string | null
  createdAt: Date
  updatedAt: Date
}

const AssetCheckoutSchema = new Schema<IAssetCheckout>(
  {
    assetId: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
    memberUid: { type: String, required: true },
    eventId: { type: String, default: null },
    eventName: { type: String, default: null },
    quantity: { type: Number, required: true, min: 1 },
    checkedOutAt: { type: Date, required: true },
    dueBackAt: { type: Date, default: null },
    returnedAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ['OUT', 'RETURNED', 'LOST', 'DAMAGED'],
      default: 'OUT',
    },
    notes: { type: String, default: null },
  },
  { timestamps: true },
)

AssetCheckoutSchema.index({ assetId: 1, status: 1 })
AssetCheckoutSchema.index({ memberUid: 1 })

export const AssetCheckout: Model<IAssetCheckout> =
  mongoose.models.AssetCheckout ||
  mongoose.model<IAssetCheckout>('AssetCheckout', AssetCheckoutSchema)
