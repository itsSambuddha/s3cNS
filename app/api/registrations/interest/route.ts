import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { DelegateRegistration } from "@/lib/db/models/DelegateRegistration"
import { Event } from "@/lib/db/models/Event"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { eventType, interestType, fullName, email, whatsAppNumber } = body

    // Validate required fields
    if (!eventType || !interestType || !fullName || !email || !whatsAppNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectToDatabase()

    // Resolve Event by type
    const event = await Event.findOne({
      type: eventType,
      status: "REG_OPEN",
    }).select("_id")

    if (!event) {
      return NextResponse.json(
        { error: "Event not found or registrations closed" },
        { status: 400 },
      )
    }

    // Create DelegateRegistration document
    const registration = await DelegateRegistration.create({
      eventId: event._id,
      eventType,
      interestType,
      fullName,
      email,
      whatsAppNumber,
      status: "APPLIED",
    })

    return NextResponse.json({ success: true, id: registration._id })
  } catch (err) {
    console.error("INTEREST_REG_ERROR", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
