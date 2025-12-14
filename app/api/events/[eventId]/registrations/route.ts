import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { DelegateRegistration } from "@/lib/db/models/DelegateRegistration"

export async function GET(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    await connectToDatabase()
    const delegates = await DelegateRegistration.find({
      eventId: params.eventId,
    })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(delegates)
  } catch (error) {
    console.error("Failed to fetch registrations", error)
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    )
  }
}
