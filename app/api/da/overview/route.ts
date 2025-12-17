// app/api/da/overview/route.ts

import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { Event } from "@/lib/db/models/Event"
import { DelegateRegistration } from "@/lib/db/models/DelegateRegistration"

export async function GET(_req: NextRequest) {
  try {
    await connectToDatabase()

    const [events, totalRegistrations] = await Promise.all([
      Event.find({})
        .sort({ createdAt: -1 })
        .select(
          "_id name type status registrationDeadline delegateFormLink ambassadorFormLink createdAt",
        ),
      DelegateRegistration.countDocuments({}),
    ])

    // count registrations per event
    const regsByEvent = await DelegateRegistration.aggregate([
      {
        $group: {
          _id: "$eventId",
          total: { $sum: 1 },
          delegates: {
            $sum: {
              $cond: [{ $eq: ["$interestType", "DELEGATE"] }, 1, 0],
            },
          },
          ambassadors: {
            $sum: {
              $cond: [{ $eq: ["$interestType", "CAMPUS_AMBASSADOR"] }, 1, 0],
            },
          },
        },
      },
    ])

    const regMap = new Map<
      string,
      { total: number; delegates: number; ambassadors: number }
    >()
    for (const row of regsByEvent) {
      if (!row._id) continue
      regMap.set(String(row._id), {
        total: row.total ?? 0,
        delegates: row.delegates ?? 0,
        ambassadors: row.ambassadors ?? 0,
      })
    }

    const eventSummaries = events.map((ev) => {
      const key = String(ev._id)
      const counts = regMap.get(key) ?? {
        total: 0,
        delegates: 0,
        ambassadors: 0,
      }

      return {
        id: key,
        name: ev.name,
        type: ev.type,
        status: ev.status,
        registrationDeadline: ev.registrationDeadline,
        delegateFormLink: ev.delegateFormLink ?? null,
        ambassadorFormLink: ev.ambassadorFormLink ?? null,
        createdAt: ev.createdAt,
        registrationCounts: counts,
      }
    })

    return NextResponse.json(
      {
        totalRegistrations,
        events: eventSummaries,
      },
      { status: 200 },
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("❌ DA overview GET error:", msg)
    return NextResponse.json(
      { error: "Failed to load DA overview" },
      { status: 500 },
    )
  }
}
