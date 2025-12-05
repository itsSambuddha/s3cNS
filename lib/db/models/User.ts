// lib/db/models/User.ts
import mongoose, { Schema, type Model, type Document } from 'mongoose'

export interface IUser extends Document {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  role: 'ADMIN' | 'LEADERSHIP' | 'TEACHER' | 'OFFICE_BEARER' | 'MEMBER'
  classId?: mongoose.Types.ObjectId
  routine?: {
    id: string
    className: string
    startTime: string
    endTime: string
    teacher: string
  }[]
  createdAt: Date
  updatedAt: Date
}

const RoutineItemSchema = new Schema(
  {
    id: { type: String, required: true },
    className: { type: String, required: true },
    startTime: { type: String, required: true }, // "08:00"
    endTime: { type: String, required: true },   // "08:30"
    teacher: { type: String, required: true },
  },
  { _id: false }
)

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
    classId: { type: Schema.Types.ObjectId, ref: 'Class' },
    routine: [RoutineItemSchema],
  },
  { timestamps: true }
)

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
