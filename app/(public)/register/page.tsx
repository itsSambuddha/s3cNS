import { redirect } from "next/navigation"
import { Event, type EventType } from "@/lib/db/models/Event"
import { connectToDatabase } from "@/lib/db/mongodb"
import { RegisterForm } from "@/components/public/RegisterForm"

function normalizeEventType(raw: string | string[] | undefined): EventType | null {
  if (!raw) return null
  const value = Array.isArray(raw) ? raw[0] : raw
  if (value === "INTRA_SECMUN" || value === "INTER_SECMUN" || value === "WORKSHOP" || value === "EDBLAZON_TIMES") {
    return value
  }
  return null
}

export default async function RegisterPage(props: { searchParams?: Record<string, string | string[]> }) {
  const eventType = normalizeEventType(props.searchParams?.eventType)
  let isRegistrationsOpen = false

  if (eventType) {
    await connectToDatabase()
    const now = new Date()
    const active = await Event.findOne({
      type: eventType,
      status: "REG_OPEN",
      $or: [
        { registrationDeadline: { $exists: false } },
        { registrationDeadline: null },
        { registrationDeadline: { $gt: now } },
      ],
    }).lean()

    isRegistrationsOpen = !!active
  }

  // you can also early-redirect if no type:
  // if (!eventType) redirect("/#participate")

  return (
    <RegisterForm
      initialEventType={eventType}
      isRegistrationsOpen={isRegistrationsOpen}
    />
  )
}
