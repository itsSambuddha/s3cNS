import { z } from 'zod'
import { EventType, FromSec, InstituteType } from '@/lib/db/models'

export const registerSchema = z.object({
  eventType: z.enum(['INTRA_SECMUN', 'INTER_SECMUN', 'WORKSHOP', 'EDBLAZON_TIMES']),
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  whatsAppNumber: z.string().min(10, 'WhatsApp number must be at least 10 digits'),
  fromSec: z.enum(['INSIDE_SEC', 'OUTSIDE_SEC']),
  // Conditional fields for OUTSIDE_SEC
  instituteType: z.enum(['COLLEGE', 'SCHOOL']).optional(),
  collegeName: z.string().optional(),
  schoolName: z.string().optional(),
  semester: z.string().optional(),
  class: z.string().optional(),
  // Conditional fields for INSIDE_SEC
  classRollNo: z.string().optional(),
  department: z.string().optional(),
  // Common fields
  pastExperience: z.string().min(1, 'Past experience is required'),
  idDocumentUrl: z.string().optional(), // For now, accept URL or stub
}).refine((data) => {
  if (data.fromSec === 'OUTSIDE_SEC') {
    return data.instituteType && (
      (data.instituteType === 'COLLEGE' && data.collegeName) ||
      (data.instituteType === 'SCHOOL' && data.schoolName)
    ) && data.semester && data.class
  }
  if (data.fromSec === 'INSIDE_SEC') {
    return data.semester && data.classRollNo && data.department
  }
  return true
}, {
  message: 'Please fill in all required fields based on your SEC affiliation',
  path: ['fromSec'],
})

export type RegisterFormData = z.infer<typeof registerSchema>
