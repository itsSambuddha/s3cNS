// lib/secretariat/data.ts

export type LeadershipRole =
  | 'PRESIDENT'
  | 'SECRETARY_GENERAL'
  | 'DIRECTOR_GENERAL'
  | 'TEACHER'

export type OfficeKey =
  | 'FINANCE'
  | 'LOGISTICS'
  | 'DELEGATION_AFFAIRS'
  | 'PUBLIC_RELATIONS'
  | 'MARKETING'
  | 'IT_DESIGN'
  | 'IT_SOCIAL_MEDIA'
  | 'CONFERENCE_MANAGEMENT'
  | 'SPONSORSHIP'

export type LeadershipMember = {
  id: string
  role: LeadershipRole
  name: string
  photoUrl: string
  email: string
  phone?: string
  academicDepartment?: string
  year?: string
  tagline?: string
}

export type SecretariatMember = {
  id: string
  name: string
  roleTitle: string
  office: OfficeKey
  photoUrl: string
  email: string
  academicDepartment?: string
  year?: string
}

// Placeholder data – to be replaced via forms later
export const leadershipMembers: LeadershipMember[] = [
  {
    id: 'president',
    role: 'PRESIDENT',
    name: 'President Name',
    photoUrl: '/placeholders/president.jpg',
    email: 'president@example.com',
    phone: '+91-00000-00000',
    academicDepartment: 'Sociology',
    year: 'TY',
    tagline: 'Leads the overall vision and external relations.',
  },
  {
    id: 'secgen',
    role: 'SECRETARY_GENERAL',
    name: 'Secretary General Name',
    photoUrl: '/placeholders/secgen.jpg',
    email: 'secgen@example.com',
    phone: '+91-00000-00001',
    academicDepartment: 'Computer Science',
    year: 'SY',
    tagline: 'Oversees operations, events, and execution.',
  },
  {
    id: 'dirgen',
    role: 'DIRECTOR_GENERAL',
    name: 'Director General Name',
    photoUrl: '/placeholders/dirgen.jpg',
    email: 'dirgen@example.com',
    phone: '+91-00000-00002',
    academicDepartment: 'Sociology',
    year: 'SY',
    tagline: 'Heads academic and committee experience.',
  },
  // Up to 3 Teachers in Charge
  {
    id: 'teacher-1',
    role: 'TEACHER',
    name: 'Teacher In‑Charge 1',
    photoUrl: '/placeholders/teacher1.jpg',
    email: 'teacher1@example.com',
    phone: '+91-00000-00003',
    academicDepartment: 'Sociology',
    tagline: 'Faculty mentor.',
  },
  {
    id: 'teacher-2',
    role: 'TEACHER',
    name: 'Teacher In‑Charge 2',
    photoUrl: '/placeholders/teacher2.jpg',
    email: 'teacher2@example.com',
    phone: '+91-00000-00004',
    academicDepartment: 'Computer Science',
    tagline: 'Faculty mentor.',
  },
  {
    id: 'teacher-3',
    role: 'TEACHER',
    name: 'Teacher In‑Charge 3',
    photoUrl: '/placeholders/teacher3.jpg',
    email: 'teacher3@example.com',
    phone: '+91-00000-00005',
    academicDepartment: 'Sociology',
    tagline: 'Faculty mentor.',
  },
]

// Secretariat offices with placeholders (one per office)
export const secretariatMembers: SecretariatMember[] = [
  {
    id: 'usg-delegation',
    name: 'To be announced',
    roleTitle: 'Under Secretary‑General',
    office: 'DELEGATION_AFFAIRS',
    photoUrl: '/placeholders/delegation.jpg',
    email: 'delegation@example.com',
  },
  {
    id: 'usg-finance',
    name: 'To be announced',
    roleTitle: 'Under Secretary‑General',
    office: 'FINANCE',
    photoUrl: '/placeholders/finance.jpg',
    email: 'finance@example.com',
  },
  {
    id: 'usg-marketing',
    name: 'To be announced',
    roleTitle: 'Under Secretary‑General',
    office: 'MARKETING',
    photoUrl: '/placeholders/marketing.jpg',
    email: 'marketing@example.com',
  },
  {
    id: 'usg-it-design',
    name: 'To be announced',
    roleTitle: 'Under Secretary‑General',
    office: 'IT_DESIGN',
    photoUrl: '/placeholders/it.jpg',
    email: 'it@example.com',
  },
  {
    id: 'usg-it-social',
    name: 'To be announced',
    roleTitle: 'Under Secretary‑General',
    office: 'IT_SOCIAL_MEDIA',
    photoUrl: '/placeholders/social.jpg',
    email: 'social@example.com',
  },
  {
    id: 'usg-pr',
    name: 'To be announced',
    roleTitle: 'Under Secretary‑General',
    office: 'PUBLIC_RELATIONS',
    photoUrl: '/placeholders/pr.jpg',
    email: 'pr@example.com',
  },
  {
    id: 'usg-conference',
    name: 'To be announced',
    roleTitle: 'Under Secretary‑General',
    office: 'CONFERENCE_MANAGEMENT',
    photoUrl: '/placeholders/conference.jpg',
    email: 'conference@example.com',
  },
  {
    id: 'usg-logistics',
    name: 'To be announced',
    roleTitle: 'Under Secretary‑General',
    office: 'LOGISTICS',
    photoUrl: '/placeholders/logistics.jpg',
    email: 'logistics@example.com',
  },
  {
    id: 'usg-sponsorship',
    name: 'To be announced',
    roleTitle: 'Under Secretary‑General',
    office: 'SPONSORSHIP',
    photoUrl: '/placeholders/sponsorship.jpg',
    email: 'sponsorship@example.com',
  },
]

export const officeLabels: Record<OfficeKey, string> = {
  FINANCE: 'Finance',
  LOGISTICS: 'Logistics',
  DELEGATION_AFFAIRS: 'Delegate Affairs',
  PUBLIC_RELATIONS: 'Public Relations (PR)',
  MARKETING: 'Marketing',
  IT_DESIGN: 'Information Technology (IT) Design',
  IT_SOCIAL_MEDIA: 'Information Technology (IT) Social Media',
  CONFERENCE_MANAGEMENT: 'Conference Management',
  SPONSORSHIP: 'Sponsorship',
}
