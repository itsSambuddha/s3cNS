import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { DelegateRegistration } from "@/lib/db/models/DelegateRegistration"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const eventType = searchParams.get("eventType")

  await connectToDatabase()

  const query = eventType ? { eventType } : {}
  const data = await DelegateRegistration.find(query)
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json({ success: true, data })
}
