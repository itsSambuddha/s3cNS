import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { DelegateRegistration } from "@/lib/db/models/DelegateRegistration"
import { Event } from "@/lib/db/models/Event"
import { sendDAInterestEmail } from "@/lib/email/sendDAEmail"
import { sendDARegistrationEmail } from "@/lib/email/sendDARegistrationEmail"

export async function POST(req: Request) {
  try {
    const { registrationId, channel, kind } = await req.json()

    if (!registrationId || !channel || !kind) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 })
    }

    await connectToDatabase()

    const reg = await DelegateRegistration.findById(registrationId)
    if (!reg) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    if (kind === "interest" && channel === "email") {
      await sendDAInterestEmail({
        to: reg.email,
        fullName: reg.fullName,
        eventName: reg.eventType.replace(/_/g, " "),
        interestType: reg.interestType!,
        email: reg.email,
        phone: reg.whatsAppNumber,
        submittedAt: reg.createdAt,
      })
      reg.emailSent = true
    }

    if (kind === "interest" && channel === "whatsapp") {
      reg.whatsappSent = true
    }

    if (kind === "registration") {
      const event = await Event.findById(reg.eventId)
      if (!event) {
        return NextResponse.json(
          { error: "Event missing" },
          { status: 400 },
        )
      }

      const link =
        reg.interestType === "DELEGATE"
          ? event.delegateFormLink
          : event.ambassadorFormLink

      if (!link) {
        return NextResponse.json(
          { error: "Form link missing" },
          { status: 400 },
        )
      }

      if (channel === "email") {
        await sendDARegistrationEmail({
        to: reg.email,
        fullName: reg.fullName,
        eventName: reg.eventType.replace(/_/g, " "),
        role: reg.interestType!,
        email: reg.email,
        phone: reg.whatsAppNumber,
        formLink: link,
      })

        reg.registrationEmailSent = true
      }

      if (channel === "whatsapp") {
        reg.registrationWhatsappSent = true
      }
    }

    await reg.save()
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
