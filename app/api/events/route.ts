// app/api/events/route.ts

import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { Event } from "@/lib/db/models/Event"
import type { EventType, EventStatus } from "@/lib/db/models/Event"

interface CreateEventBody {
  name?: string
  type?: EventType
  status?: EventStatus
  registrationDeadline?: string | null
  startDate?: string
  endDate?: string
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const searchParams = req.nextUrl.searchParams
    const type = searchParams.get("type") as EventType | null
    const status = searchParams.get("status") as EventStatus | null

    const filter: Record<string, unknown> = {}
    if (type) filter.type = type
    if (status) filter.status = status

    const events = await Event.find(filter)
      .sort({ createdAt: -1 })
      .select(
        "_id name type status registrationDeadline delegateFormLink ambassadorFormLink startDate endDate createdAt",
      )

    const data = events.map((ev) => ({
      id: String(ev._id),
      name: ev.name,
      type: ev.type,
      status: ev.status,
      registrationDeadline: ev.registrationDeadline,
      delegateFormLink: ev.delegateFormLink ?? null,
      ambassadorFormLink: ev.ambassadorFormLink ?? null,
      startDate: ev.startDate,
      endDate: ev.endDate,
      createdAt: ev.createdAt,
    }))

    return NextResponse.json({ events: data }, { status: 200 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("❌ events GET error:", msg)
    return NextResponse.json(
      { error: "Failed to load events" },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateEventBody
    const {
      name,
      type,
      status = "REG_CLOSED",
      registrationDeadline,
      startDate,
      endDate,
    } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "name is required", code: "MISSING_NAME" },
        { status: 400 },
      )
    }

    if (!type) {
      return NextResponse.json(
        { error: "type is required", code: "MISSING_TYPE" },
        { status: 400 },
      )
    }

    if (!startDate || !endDate) {
      return NextResponse.json(
        {
          error: "startDate and endDate are required",
          code: "MISSING_DATES",
        },
        { status: 400 },
      )
    }

    await connectToDatabase()

    if (status === "REG_OPEN") {
      await Event.updateMany(
        { type },
        { $set: { status: "REG_CLOSED" } },
      )
    }

    const doc = await Event.create({
      name: name.trim(),
      type,
      status,
      registrationDeadline:
        registrationDeadline === null
          ? null
          : registrationDeadline
          ? new Date(registrationDeadline)
          : null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    })

    const created = {
      id: String(doc._id),
      name: doc.name,
      type: doc.type,
      status: doc.status,
      registrationDeadline: doc.registrationDeadline,
      delegateFormLink: doc.delegateFormLink ?? null,
      ambassadorFormLink: doc.ambassadorFormLink ?? null,
      startDate: doc.startDate,
      endDate: doc.endDate,
      createdAt: doc.createdAt,
    }

    return NextResponse.json({ event: created }, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("❌ events POST error:", msg)
    return NextResponse.json(
      { error: "Failed to create event", details: msg },
      { status: 500 },
    )
  }
}
