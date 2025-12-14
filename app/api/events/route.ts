import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { Event } from "@/lib/db/models/Event"

export async function GET() {
  try {
    await connectToDatabase()
    const events = await Event.find({}).sort({ createdAt: -1 })
    return NextResponse.json(events)
  } catch (error) {
    console.error("Failed to fetch events", error)
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const body = await req.json()

    const event = await Event.create({
      name: body.name,
      code: body.code,
      type: body.type,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      venue: body.venue,
      owningOffice: body.owningOffice || "DA",
      status: body.status || "PLANNING",
      activeCommitteeIds: [],
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error("Failed to create event", error)
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    )
  }
}
