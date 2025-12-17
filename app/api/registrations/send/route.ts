// app/api/registrations/send/route.ts

import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { DelegateRegistration } from "@/lib/db/models/DelegateRegistration"
import { Event } from "@/lib/db/models/Event"
import { sendDAInterestEmail } from "@/lib/email/sendDAInterestEmail"
import { sendDARegistrationEmail } from "@/lib/email/sendDARegistrationEmail"

type Mode = "INTEREST" | "REGISTRATION"
type InterestType = "DELEGATE" | "CAMPUS_AMBASSADOR"

interface SendBody {
  mode: Mode
  eventId?: string | null
  interestType?: InterestType | null
  registrationId?: string | null
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SendBody
    const { mode, eventId, interestType, registrationId } = body

    if (mode !== "INTEREST" && mode !== "REGISTRATION") {
      return NextResponse.json(
        { error: "Invalid mode", code: "INVALID_MODE" },
        { status: 400 },
      )
    }

    if (!registrationId && !eventId) {
      return NextResponse.json(
        { error: "eventId is required", code: "MISSING_EVENT_ID" },
        { status: 400 },
      )
    }

    await connectToDatabase()

    // Build registration filter (bulk or single)
    const filter: any = {}
    if (registrationId) {
      filter._id = registrationId
    } else if (eventId) {
      filter.eventId = eventId
    }
    if (interestType) {
      filter.interestType = interestType
    }

    const registrations = await DelegateRegistration.find(filter).sort({
      createdAt: 1,
    })

    if (registrations.length === 0) {
      return NextResponse.json(
        { message: "No registrations found for the given criteria", count: 0 },
        { status: 200 },
      )
    }

    // Resolve event from the first registration (for per-row) or from body
    const effectiveEventId = registrations[0].eventId ?? eventId
    if (!effectiveEventId) {
      return NextResponse.json(
        { error: "Event not found", code: "EVENT_NOT_FOUND" },
        { status: 404 },
      )
    }

    const event = await Event.findById(effectiveEventId).select(
      "name type status delegateFormLink ambassadorFormLink",
    )
    if (!event) {
      return NextResponse.json(
        { error: "Event not found", code: "EVENT_NOT_FOUND" },
        { status: 404 },
      )
    }

    let successCount = 0
    let errorCount = 0

    for (const reg of registrations) {
      try {
        const role: InterestType =
          (reg.interestType as InterestType | null) ?? "DELEGATE"

        if (mode === "INTEREST") {
          await sendDAInterestEmail({
            to: reg.email,
            fullName: reg.fullName,
            eventName: event.name,
            interestType: role,
          })
          reg.emailSent = true
        } else {
          const registrationLink =
            role === "CAMPUS_AMBASSADOR"
              ? event.ambassadorFormLink ?? ""
              : event.delegateFormLink ?? ""

          await sendDARegistrationEmail({
            to: reg.email,
            fullName: reg.fullName,
            eventName: event.name,
            role,
            email: reg.email,
            phone: reg.whatsAppNumber,
            formLink: registrationLink,
          })
          reg.registrationEmailSent = true
        }

        await reg.save()
        successCount += 1
      } catch (err) {
        errorCount += 1
        console.error(
          `❌ Failed sending ${mode} EMAIL for registration ${reg._id}:`,
          err,
        )
      }
    }

    return NextResponse.json(
      {
        success: true,
        mode,
        total: registrations.length,
        successCount,
        errorCount,
      },
      { status: 200 },
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("❌ registrations/send POST error:", msg)
    return NextResponse.json(
      { error: "Failed to send communications", code: "INTERNAL_ERROR" },
      { status: 500 },
    )
  }
}
