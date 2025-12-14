import { notFound } from 'next/navigation'
import { connectToDatabase } from '@/lib/db/connect'
import { Event } from '@/lib/db/models/Event'
import RegisterForm from './_components/RegisterForm'

interface PageProps {
  searchParams: Promise<{ eventType?: string }>
}

export default async function RegisterPage({ searchParams }: PageProps) {
  const params = await searchParams
  const eventType = params.eventType

  if (!eventType || !['INTRA_SECMUN', 'INTER_SECMUN', 'WORKSHOP', 'EDBLAZON_TIMES'].includes(eventType)) {
    notFound()
  }

  try {
    await connectToDatabase()
    const now = new Date()
    const event = await Event.findOne({
      type: eventType,
      status: 'REG_OPEN',
      $or: [
        { registrationDeadline: { $exists: false } },
        { registrationDeadline: null },
        { registrationDeadline: { $gt: now } }
      ]
    })

    if (!event) {
      notFound()
    }

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Register for {event.name}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Fill out the form below to apply for this event.
              </p>
            </div>

            <RegisterForm eventType={eventType} eventName={event.name} />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching event:', error)
    notFound()
  }
}
