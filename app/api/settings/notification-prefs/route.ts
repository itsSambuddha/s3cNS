import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/connect"
import { User as UserModel } from "@/lib/db/models/User"
import { getCurrentUser } from "@/lib/auth/getCurrentUser"

export async function POST(req: NextRequest) {
  const current = await getCurrentUser()
  if (!current) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { userId, prefs } = await req.json()
  if (!userId || String(userId) !== String(current._id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await connectToDatabase()

  await UserModel.updateOne(
    { _id: current._id },
    { $set: { notificationPreferences: prefs } },
  )

  return NextResponse.json({ success: true })
}