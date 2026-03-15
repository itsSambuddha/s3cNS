import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/connect"
import NotificationModel from "@/lib/db/models/Notification"
import { getCurrentUser } from "@/lib/auth/getCurrentUser"

export async function POST(_req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await connectToDatabase()

  await NotificationModel.deleteMany({
    userId: user._id,
  })

  return NextResponse.json({ success: true })
}
