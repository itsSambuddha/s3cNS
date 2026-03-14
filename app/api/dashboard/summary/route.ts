import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/connect"
import { User } from "@/lib/db/models/User"
import { Event } from "@/lib/db/models/Event"
import { getCurrentUser } from "@/lib/auth/getCurrentUser"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // 1. Fetch Events count (Active SEC-NEXUS events)
    // We filter by REG_OPEN for now as a proxy for "Active"
    const eventsCount = await Event.countDocuments({ status: "REG_OPEN" })

    // 2. Fetch Pending Approvals (Secretariat applicants)
    // Counting users with status APPLICANT
    const pendingApprovals = await User.countDocuments({ memberStatus: "APPLICANT" })

    return NextResponse.json({
      eventsCount,
      pendingApprovals,
    })
  } catch (err: any) {
    console.error("Dashboard summary API error:", err)
    return NextResponse.json(
      { error: "Failed to load dashboard summary" },
      { status: 500 }
    )
  }
}
