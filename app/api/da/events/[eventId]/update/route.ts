// app/api/da/events/[eventId]/update/route.ts
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { Event } from "@/lib/db/models/Event"

type RouteParams = {
  params: { eventId: string }
}

export async function POST(req: Request, { params }: RouteParams) {
  try {
    const { eventId } = params
    const body = await req.json()

    const {
      status,
      delegateFormLink,
      ambassadorFormLink,
    }: {
      status?: "REG_OPEN" | "REG_CLOSED"
      delegateFormLink?: string
      ambassadorFormLink?: string
    } = body

    await connectToDatabase()

    const update: Record<string, any> = {}

    if (status) update.status = status
    if (delegateFormLink !== undefined)
      update.delegateFormLink = delegateFormLink
    if (ambassadorFormLink !== undefined)
      update.ambassadorFormLink = ambassadorFormLink

    const updated = await Event.findByIdAndUpdate(
      eventId,
      { $set: update },
      { new: true },
    ).lean()

    if (!updated) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[DA_EVENT_UPDATE_ERROR]", err)
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 },
    )
  }
}
