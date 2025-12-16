import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { Event } from "@/lib/db/models/Event"

export async function GET() {
  try {
    await connectToDatabase()

    const events = await Event.find({})
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      data: events,
    })
  } catch (err) {
    console.error("Failed to fetch events", err)
    return NextResponse.json(
      { success: false, data: [] },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const body = await req.json()

    const event = await Event.create({
      name: body.name,
      type: body.type,
      status: body.status ?? "REG_CLOSED",
      registrationDeadline: body.registrationDeadline
        ? new Date(body.registrationDeadline)
        : null,
      delegateFormLink: body.delegateFormLink || "",
      ambassadorFormLink: body.ambassadorFormLink || "",
    })

    return NextResponse.json(
      { success: true, data: event },
      { status: 201 },
    )
  } catch (err) {
    console.error("Failed to create event", err)
    return NextResponse.json(
      { success: false, error: "Failed to create event" },
      { status: 500 },
    )
  }
}
