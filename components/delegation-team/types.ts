'use client'

// Shared types for the Delegation Team module
export type DelegateAward =
  | 'BEST_DELEGATE'
  | 'HIGH_COMMENDATION'
  | 'SPECIAL_MENTION'
  | 'VERBAL_MENTION'
  | null

export type DelegateStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface OutboundDelegate {
  _id: string
  fullName: string
  semester: string
  dept: string
  experience: string
  rollNo: string
  attendance: number
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

export interface OutboundConference {
  _id: string
  name: string
  venue: string
  dates: string[]
  delegates: OutboundDelegate[]
  teamAward: string
  teamPhotoUrl: string
  photoContactName: string
  photoContactNo: string
}

export const AWARD_OPTIONS: { value: DelegateAward; label: string }[] = [
  { value: null, label: 'No Award' },
  { value: 'BEST_DELEGATE', label: '🥇 Best Delegate' },
  { value: 'HIGH_COMMENDATION', label: '🥈 High Commendation' },
  { value: 'SPECIAL_MENTION', label: '🥉 Special Mention' },
  { value: 'VERBAL_MENTION', label: '🎖️ Verbal Mention' },
]

export const STATUS_COLORS: Record<DelegateStatus, string> = {
  APPROVED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  REJECTED: 'bg-red-100 text-red-700 border-red-200',
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
}

export const TEAM_AWARD_PRESETS = [
  'Best Delegation',
  'Outstanding Delegation',
  'Special Commendation',
]
