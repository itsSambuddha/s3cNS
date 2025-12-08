// lib/db/models/Asset.ts
import mongoose, { Schema, type Document, type Model } from 'mongoose'

export type AssetCondition = 'GOOD' | 'FAIR' | 'DAMAGED' | 'LOST'

export interface IAsset extends Document {
  name: string
  category: string
  totalQuantity: number
  availableQuantity: number
  condition: AssetCondition
  location?: string | null
  notes?: string | null
  createdAt: Date
  updatedAt: Date
}

const AssetSchema = new Schema<IAsset>(
  {
    name: { type: String, required: true },
    category: { type: String, default: 'GENERAL' },
    totalQuantity: { type: Number, required: true, min: 0 },
    availableQuantity: { type: Number, required: true, min: 0 },
    condition: {
      type: String,
      enum: ['GOOD', 'FAIR', 'DAMAGED', 'LOST'],
      default: 'GOOD',
    },
    location: { type: String, default: null },
    notes: { type: String, default: null },
  },
  { timestamps: true },
)

AssetSchema.index({ name: 1 })

export const Asset: Model<IAsset> =
  mongoose.models.Asset || mongoose.model<IAsset>('Asset', AssetSchema)
