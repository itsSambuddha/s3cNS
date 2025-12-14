import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { Committee } from "@/lib/db/models/Committee"

export async function GET(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    await connectToDatabase()
    const committees = await Committee.find({ eventId: params.eventId })
      .sort({ name: 1 })
      .lean()

    return NextResponse.json(committees)
  } catch (error) {
    console.error("Failed to fetch committees", error)
    return NextResponse.json(
      { error: "Failed to fetch committees" },
      { status: 500 }
    )
  }
}
