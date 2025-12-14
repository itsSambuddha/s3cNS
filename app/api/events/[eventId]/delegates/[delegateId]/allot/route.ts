import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { DelegateRegistration } from "@/lib/db/models/DelegateRegistration"

export async function PATCH(
  req: Request,
  {
    params,
  }: { params: { eventId: string; delegateId: string } }
) {
  try {
    await connectToDatabase()
    const body = await req.json()

    const delegate = await DelegateRegistration.findByIdAndUpdate(
      params.delegateId,
      {
        delegateCode: body.delegateCode,
        status: body.status,
      },
      { new: true }
    ).lean()

    if (!delegate) {
      return NextResponse.json(
        { error: "Delegate not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(delegate)
  } catch (error) {
    console.error("Failed to save allotment", error)
    return NextResponse.json(
      { error: "Failed to save allotment" },
      { status: 500 }
    )
  }
}
