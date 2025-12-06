// lib/secretariat/data.ts

export type LeadershipRole =
  | 'PRESIDENT'
  | 'SECRETARY_GENERAL'
  | 'DIRECTOR_GENERAL'
  | 'TEACHER'

export type OfficeKey =
  | 'DELEGATION_AFFAIRS'
  | 'SPONSORSHIP'
  | 'MARKETING'
  | 'FINANCE'
  | 'IT_DESIGN'
  | 'IT_SOCIAL_MEDIA'
  | 'PUBLIC_RELATIONS'
  | 'CONFERENCE_MANAGEMENT'
  | 'LOGISTICS'

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

// Secretariat offices with placeholders
export const secretariatMembers: SecretariatMember[] = [
  {
    id: 'usg-delegation',
    name: 'USG Delegation Affairs',
    roleTitle: 'Under Secretary‑General',
    office: 'DELEGATION_AFFAIRS',
    photoUrl: '/placeholders/delegation.jpg',
    email: 'delegation@example.com',
    academicDepartment: 'Sociology',
    year: 'TY',
  },
  {
    id: 'usg-sponsorship',
    name: 'USG Sponsorship',
    roleTitle: 'Under Secretary‑General',
    office: 'SPONSORSHIP',
    photoUrl: '/placeholders/sponsorship.jpg',
    email: 'sponsorship@example.com',
    academicDepartment: 'Computer Science',
    year: 'SY',
  },
  // add more placeholders per office as needed
]

export const officeLabels: Record<OfficeKey, string> = {
  DELEGATION_AFFAIRS: 'Delegation Affairs',
  SPONSORSHIP: 'Sponsorship',
  MARKETING: 'Marketing',
  FINANCE: 'Finance',
  IT_DESIGN: 'IT · Design',
  IT_SOCIAL_MEDIA: 'IT · Social Media',
  PUBLIC_RELATIONS: 'Public Relations',
  CONFERENCE_MANAGEMENT: 'Conference Management',
  LOGISTICS: 'Logistics',
}
