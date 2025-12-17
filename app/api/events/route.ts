// app/api/events/route.ts

import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { Event } from "@/lib/db/models/Event"

type EventType = "INTRA_SECMUN" | "INTER_SECMUN" | "WORKSHOP" | "EDBLAZON_TIMES"
type EventStatus = "REG_OPEN" | "REG_CLOSED"

interface CreateEventBody {
  name?: string
  type?: EventType
  status?: EventStatus
  registrationDeadline?: string | null
  delegateFormLink?: string | null
  ambassadorFormLink?: string | null
}

// GET /api/events?type=&status=
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
        "_id name type status registrationDeadline delegateFormLink ambassadorFormLink createdAt",
      )

    const data = events.map((ev) => ({
      id: String(ev._id),
      name: ev.name,
      type: ev.type,
      status: ev.status,
      registrationDeadline: ev.registrationDeadline,
      delegateFormLink: ev.delegateFormLink ?? null,
      ambassadorFormLink: ev.ambassadorFormLink ?? null,
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

// POST /api/events  (create new event)
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateEventBody
    const {
      name,
      type,
      status = "REG_CLOSED",
      registrationDeadline,
      delegateFormLink,
      ambassadorFormLink,
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

    const validTypes: EventType[] = [
      "INTRA_SECMUN",
      "INTER_SECMUN",
      "WORKSHOP",
      "EDBLAZON_TIMES",
    ]
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          error: `Invalid type. Must be one of: ${validTypes.join(", ")}`,
          code: "INVALID_TYPE",
        },
        { status: 400 },
      )
    }

    const validStatuses: EventStatus[] = ["REG_OPEN", "REG_CLOSED"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
          code: "INVALID_STATUS",
        },
        { status: 400 },
      )
    }

    await connectToDatabase()

    // If creating a REG_OPEN event, close other events of same type
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
      delegateFormLink: delegateFormLink ?? undefined,
      ambassadorFormLink: ambassadorFormLink ?? undefined,
    })

    const created = {
      id: String(doc._id),
      name: doc.name,
      type: doc.type,
      status: doc.status,
      registrationDeadline: doc.registrationDeadline,
      delegateFormLink: doc.delegateFormLink ?? null,
      ambassadorFormLink: doc.ambassadorFormLink ?? null,
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
