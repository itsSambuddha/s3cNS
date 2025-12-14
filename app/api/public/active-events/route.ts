import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { Event, type EventType } from "@/lib/db/models/Event"

export async function GET() {
  await connectToDatabase()
  const now = new Date()

  const types: EventType[] = [
    "INTRA_SECMUN",
    "INTER_SECMUN",
    "WORKSHOP",
    "EDBLAZON_TIMES",
  ]

  const results: Record<EventType, boolean> = {
    INTRA_SECMUN: false,
    INTER_SECMUN: false,
    WORKSHOP: false,
    EDBLAZON_TIMES: false,
  }

  const events = await Event.aggregate([
    {
      $match: {
        type: { $in: types },
        status: "REG_OPEN",
        $or: [
          { registrationDeadline: { $exists: false } },
          { registrationDeadline: null },
          { registrationDeadline: { $gt: now } },
        ],
      },
    },
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
      },
    },
  ])

  for (const e of events) {
    results[e._id as EventType] = e.count > 0
  }

  return NextResponse.json(results)
}
