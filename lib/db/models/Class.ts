// lib/db/models/Class.ts
import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IClass extends Document {
  name: string              // e.g. "TY B.A. (IR) A"
  code: string              // e.g. "BAIR-TY-A"
  year: number              // academic year, e.g. 2025
  department?: string
}

const ClassSchema = new Schema<IClass>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    year: { type: Number, required: true },
    department: { type: String },
  },
  { timestamps: true }
)

export const ClassModel: Model<IClass> =
  mongoose.models.Class || mongoose.model<IClass>('Class', ClassSchema)
