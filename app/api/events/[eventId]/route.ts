import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { Event } from "@/lib/db/models/Event"

type Params = {
  params: { eventId: string }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const body = await req.json()
    await connectToDatabase()

    const updated = await Event.findByIdAndUpdate(
      params.eventId,
      { $set: body },
      { new: true }
    )

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (err) {
    console.error("[EVENT_UPDATE_ERROR]", err)
    return NextResponse.json(
      { success: false, error: "Failed to update event" },
      { status: 500 }
    )
  }
}
