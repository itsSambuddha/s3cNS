import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { DelegateRegistration } from "@/lib/db/models/DelegateRegistration"
import { Event } from "@/lib/db/models/Event"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get("eventId")

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: "eventId required" },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const event = await Event.findById(eventId).lean()
    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      )
    }

    const regs = await DelegateRegistration.find({ eventId }).lean()

    const interestRegs = regs.filter(r => r.interestType)
    const fullRegs = regs.filter(r => !r.interestType)

    return NextResponse.json({
      success: true,
      event: {
        _id: event._id.toString(),
        name: event.name,
        type: event.type,
        status: event.status,
        delegateFormLink: event.delegateFormLink || "",
        ambassadorFormLink: event.ambassadorFormLink || "",
      },
      stats: {
        total: regs.length,

        interest: {
          total: interestRegs.length,
          emailSent: interestRegs.filter(r => r.emailSent).length,
          whatsappSent: interestRegs.filter(r => r.whatsappSent).length,
        },

        registration: {
          total: fullRegs.length,
          emailSent: fullRegs.filter(r => r.paymentClaimed).length,
          whatsappSent: fullRegs.filter(r => r.paymentRef).length,
        },
      },
    })
  } catch (err) {
    console.error("[DA_OVERVIEW_EVENT_ERROR]", err)
    return NextResponse.json(
      { success: false, error: "Failed to load overview" },
      { status: 500 }
    )
  }
}
