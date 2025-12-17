// app/api/events/[id]/route.ts

import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { Event } from "@/lib/db/models/Event"

interface Params {
  params: { id: string }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = params
    if (!id) {
      return NextResponse.json(
        { error: "Missing event id" },
        { status: 400 },
      )
    }

    await connectToDatabase()

    const res = await Event.findByIdAndDelete(id)
    if (!res) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("❌ events DELETE error:", msg)
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 },
    )
  }
}
