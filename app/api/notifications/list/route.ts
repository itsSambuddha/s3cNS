import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/connect"
import NotificationModel from "@/lib/db/models/Notification"
import { getCurrentUser } from "@/lib/auth/getCurrentUser"

export async function GET(_req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await connectToDatabase()

  const items = await NotificationModel.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean()

  return NextResponse.json({
    notifications: items.map((n) => ({
      id: String(n._id),
      category: n.category,
      title: n.title,
      body: n.body,
      url: n.url,
      createdAt: n.createdAt,
      readAt: n.readAt,
    })),
  })
}