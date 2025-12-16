// app/api/da/events/[eventId]/overview/route.ts
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { Event } from "@/lib/db/models/Event"
import { DelegateRegistration } from "@/lib/db/models/DelegateRegistration"

type RouteParams = {
  params: { eventId: string }
}

export async function GET(_: Request, { params }: RouteParams) {
  const { eventId } = params

  await connectToDatabase()

  const event = await Event.findById(eventId).lean()
  if (!event) {
    return NextResponse.json(
      { error: "Event not found" },
      { status: 404 },
    )
  }

  const registrations = await DelegateRegistration.find({
    eventId: event._id,
  }).lean()

  const stats = {
    total: registrations.length,
    delegates: registrations.filter(
      (r) => r.interestType === "DELEGATE",
    ).length,
    ambassadors: registrations.filter(
      (r) => r.interestType === "CAMPUS_AMBASSADOR",
    ).length,

    interestEmailSent: registrations.filter((r) => r.emailSent).length,
    interestWhatsappSent: registrations.filter((r) => r.whatsappSent).length,

    registrationEmailSent: registrations.filter(
      (r) => r.status === "ALLOTTED" && r.emailSent,
    ).length,
    registrationWhatsappSent: registrations.filter(
      (r) => r.status === "ALLOTTED" && r.whatsappSent,
    ).length,
  }

  return NextResponse.json({
    eventName: event.name,
    eventType: event.type,
    isOpen: event.status === "REG_OPEN",
    stats,
    forms: {
      delegate: event.delegateFormLink || "",
      ambassador: event.ambassadorFormLink || "",
    },
  })
}
