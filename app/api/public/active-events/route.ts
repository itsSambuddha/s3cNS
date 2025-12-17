// app/api/public/active-events/route.ts

import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { Event } from "@/lib/db/models/Event"

const TYPES = ["INTRA_SECMUN", "INTER_SECMUN", "WORKSHOP", "EDBLAZON_TIMES"] as const
type EventType = (typeof TYPES)[number]

export async function GET(_req: NextRequest) {
  try {
    await connectToDatabase()

    const results = await Promise.all(
      TYPES.map(async (type) => {
        const ev = await Event.findOne({
          type,
          status: "REG_OPEN",
        })
          .sort({ createdAt: -1 })
          .select("_id name type status registrationDeadline delegateFormLink ambassadorFormLink createdAt")

        return {
          type,
          event: ev
            ? {
                id: String(ev._id),
                name: ev.name,
                type: ev.type,
                status: ev.status,
                registrationDeadline: ev.registrationDeadline,
                delegateFormLink: ev.delegateFormLink ?? null,
                ambassadorFormLink: ev.ambassadorFormLink ?? null,
              }
            : null,
        }
      }),
    )

    return NextResponse.json({ eventsByType: results }, { status: 200 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("❌ active-events error:", msg)
    return NextResponse.json(
      { error: "Failed to load active events" },
      { status: 500 },
    )
  }
}
