// lib/db/models/User.ts
import mongoose, { Schema, type Model, type Document } from 'mongoose'

export type AppRole =
  | 'ADMIN'
  | 'LEADERSHIP'
  | 'TEACHER'
  | 'OFFICE_BEARER'
  | 'MEMBER'

export type SecretariatRole =
  | 'PRESIDENT'
  | 'SECRETARY_GENERAL'
  | 'DIRECTOR_GENERAL'
  | 'USG'
  | 'TEACHER'
  | 'MEMBER'

export type SecretariatOffice =
  | 'DELEGATION_AFFAIRS'
  | 'SPONSORSHIP'
  | 'MARKETING'
  | 'FINANCE'
  | 'IT_DESIGN'
  | 'IT_SOCIAL_MEDIA'
  | 'PUBLIC_RELATIONS'
  | 'CONFERENCE_MANAGEMENT'
  | 'LOGISTICS'
  | null

export type MemberStatus = 'ACTIVE' | 'ALUMNI' | 'APPLICANT' | 'REJECTED'



export interface IUser extends Document {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  role: AppRole

  // Academic + personal
  phone?: string
  rollNo?: string
  year?: string // e.g. "FY", "SY", "TY"
  academicDepartment?: string // "Sociology", "Computer Science"



  // Secretariat profile
  secretariatRole: SecretariatRole
  office: SecretariatOffice
  memberStatus: MemberStatus

  // Permission flags
  canManageMembers: boolean
  canApproveUSG: boolean
  canManageFinance: boolean
  canManageEvents: boolean

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

    phone: { type: String },
    rollNo: { type: String },
    year: { type: String },
    academicDepartment: { type: String },



    secretariatRole: {
      type: String,
      enum: [
        'PRESIDENT',
        'SECRETARY_GENERAL',
        'DIRECTOR_GENERAL',
        'USG',
        'TEACHER',
        'MEMBER',
      ],
      default: 'MEMBER',
    },
    office: {
      type: String,
      enum: [
        'DELEGATION_AFFAIRS',
        'SPONSORSHIP',
        'MARKETING',
        'FINANCE',
        'IT_DESIGN',
        'IT_SOCIAL_MEDIA',
        'PUBLIC_RELATIONS',
        'CONFERENCE_MANAGEMENT',
        'LOGISTICS',
        null,
      ],
      default: null,
    },
    memberStatus: {
      type: String,
      enum: ['ACTIVE', 'ALUMNI', 'APPLICANT', 'REJECTED'],
      default: 'APPLICANT',
    },

    canManageMembers: { type: Boolean, default: false },
    canApproveUSG: { type: Boolean, default: false },
    canManageFinance: { type: Boolean, default: false },
    canManageEvents: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
