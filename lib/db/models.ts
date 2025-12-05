// lib/db/models.ts
import mongoose, { Schema, type Model, type Document } from 'mongoose'

export interface IUser extends Document {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  role: 'ADMIN' | 'LEADERSHIP' | 'TEACHER' | 'OFFICE_BEARER' | 'MEMBER'
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, index: true },
    displayName: { type: String },
    photoURL: { type: String },
    role: {
      type: String,
      enum: ['ADMIN', 'LEADERSHIP', 'TEACHER', 'OFFICE_BEARER', 'MEMBER'],
      default: 'MEMBER',
    },
  },
  { timestamps: true }
)

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
