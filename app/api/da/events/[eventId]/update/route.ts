// app/api/da/events/[eventId]/update/route.ts

import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { Event } from "@/lib/db/models/Event"

interface UpdateBody {
  name?: string
  status?: "REG_OPEN" | "REG_CLOSED"
  registrationDeadline?: string | null
  delegateFormLink?: string | null
  ambassadorFormLink?: string | null
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ eventId: string }> },
) {
  try {
    const { eventId } = await ctx.params
    const body = (await req.json()) as UpdateBody

    await connectToDatabase()

    const update: any = {}

    if (typeof body.name === "string") update.name = body.name
    if (body.status === "REG_OPEN" || body.status === "REG_CLOSED") {
      update.status = body.status
    }

    if (body.registrationDeadline === null) {
      update.registrationDeadline = null
    } else if (typeof body.registrationDeadline === "string") {
      update.registrationDeadline = new Date(body.registrationDeadline)
    }

    if (typeof body.delegateFormLink === "string" || body.delegateFormLink === null) {
      update.delegateFormLink = body.delegateFormLink
    }

    if (
      typeof body.ambassadorFormLink === "string" ||
      body.ambassadorFormLink === null
    ) {
      update.ambassadorFormLink = body.ambassadorFormLink
    }

    // if status is set to REG_OPEN, close others of same type
    let eventBefore = await Event.findById(eventId).select("type status")
    if (!eventBefore) {
      return NextResponse.json(
        { error: "Event not found", code: "EVENT_NOT_FOUND" },
        { status: 404 },
      )
    }

    if (update.status === "REG_OPEN" && eventBefore.type) {
      await Event.updateMany(
        { type: eventBefore.type, _id: { $ne: eventId } },
        { $set: { status: "REG_CLOSED" } },
      )
    }

    const updated = await Event.findByIdAndUpdate(eventId, update, {
      new: true,
    }).select(
      "_id name type status registrationDeadline delegateFormLink ambassadorFormLink createdAt",
    )

    return NextResponse.json({ event: updated }, { status: 200 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("❌ DA event update error:", msg)
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 },
    )
  }
}
