import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/connect"
import NotificationModel from "@/lib/db/models/Notification"
import { getCurrentUser } from "@/lib/auth/getCurrentUser"

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  await connectToDatabase()

  const result = await NotificationModel.deleteOne({
    _id: id,
    userId: user._id,
  })

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Notification not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
