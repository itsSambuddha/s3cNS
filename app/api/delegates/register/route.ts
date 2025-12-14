import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { Event } from '@/lib/db/models/Event'
import { DelegateRegistration } from '@/lib/db/models/DelegateRegistration'
import { registerSchema } from '@/lib/schemas/registerSchema'

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const body = await request.json()

    // Validate the request body
    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Find active event for the given eventType
    const now = new Date()
    const event = await Event.findOne({
      type: data.eventType,
      status: 'REG_OPEN',
      $or: [
        { registrationDeadline: { $exists: false } },
        { registrationDeadline: null },
        { registrationDeadline: { $gt: now } }
      ]
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Registrations for this event are closed.' },
        { status: 400 }
      )
    }

    // Create the delegate registration
    const registration = new DelegateRegistration({
      eventId: event._id,
      eventType: event.type,
      fullName: data.fullName,
      email: data.email,
      whatsAppNumber: data.whatsAppNumber,
      fromSec: data.fromSec,
      pastExperience: data.pastExperience,
      status: 'APPLIED',
      // Conditional fields
      ...(data.fromSec === 'INSIDE_SEC' && {
        insideSecInfo: {
          semester: data.semester,
          classRollNo: data.classRollNo,
          department: data.department,
          idDocumentUrl: data.idDocumentUrl,
        }
      }),
      ...(data.fromSec === 'OUTSIDE_SEC' && {
        outsideSecInfo: {
          instituteType: data.instituteType,
          collegeName: data.collegeName,
          schoolName: data.schoolName,
          semester: data.semester,
          class: data.class,
          idDocumentUrl: data.idDocumentUrl,
        }
      }),
    })

    await registration.save()

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
