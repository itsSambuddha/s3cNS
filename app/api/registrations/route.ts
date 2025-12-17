// app/api/registrations/route.ts

import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { DelegateRegistration } from "@/lib/db/models/DelegateRegistration"
import { Event } from "@/lib/db/models/Event"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const eventId = searchParams.get("eventId")
    const eventType = searchParams.get("eventType")
    const interestType = searchParams.get("interestType")

    await connectToDatabase()

    const filter: Record<string, unknown> = {}

    if (eventId) {
      filter.eventId = eventId
    }

    if (eventType) {
      filter.eventType = eventType
    }

    if (interestType) {
      filter.interestType = interestType
    }

    const registrations = await DelegateRegistration.find(filter)
      .sort({ createdAt: -1 })

    // Fetch event names in a second step to avoid populate edge cases
    const eventIds = Array.from(
      new Set(
        registrations
          .map((r) => (r.eventId ? String(r.eventId) : null))
          .filter(Boolean),
      ),
    ) as string[]

    const events = await Event.find({ _id: { $in: eventIds } }).select(
      "_id name type status",
    )

    const eventMap = new Map<string, { name: string; type: string; status: string }>()
    for (const ev of events) {
      eventMap.set(String(ev._id), {
        name: ev.name,
        type: ev.type,
        status: ev.status,
      })
    }

    const data = registrations.map((reg) => {
      const evInfo = reg.eventId
        ? eventMap.get(String(reg.eventId))
        : undefined

      return {
        id: String(reg._id),
        eventId: reg.eventId ? String(reg.eventId) : null,
        eventName: evInfo?.name ?? null,
        eventType: reg.eventType,
        interestType: reg.interestType ?? null,
        fullName: reg.fullName,
        email: reg.email,
        whatsAppNumber: reg.whatsAppNumber,
        status: reg.status,
        emailSent: reg.emailSent,
        whatsappSent: reg.whatsappSent,
        registrationEmailSent: reg.registrationEmailSent,
        registrationWhatsappSent: reg.registrationWhatsappSent,
        createdAt: reg.createdAt,
      }
    })

    return NextResponse.json({ registrations: data }, { status: 200 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("❌ registrations GET error:", msg)
    return NextResponse.json(
      { error: "Failed to load registrations", details: msg },
      { status: 500 },
    )
  }
}
