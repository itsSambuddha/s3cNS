import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { Portfolio } from "@/lib/db/models/Portfolio"

export async function GET(
  req: Request,
  {
    params,
  }: { params: { eventId: string; committeeId: string } }
) {
  try {
    await connectToDatabase()
    const portfolios = await Portfolio.find({
      eventId: params.eventId,
      committeeId: params.committeeId,
    })
      .sort({ label: 1 })
      .lean()

    return NextResponse.json(portfolios)
  } catch (error) {
    console.error("Failed to fetch portfolios", error)
    return NextResponse.json(
      { error: "Failed to fetch portfolios" },
      { status: 500 }
    )
  }
}

export async function POST(
  req: Request,
  {
    params,
  }: { params: { eventId: string; committeeId: string } }
) {
  try {
    await connectToDatabase()
    const body = await req.json()

    const portfolio = await Portfolio.create({
      eventId: params.eventId,
      committeeId: params.committeeId,
      label: body.label,
      code: body.code,
      type: body.type,
    })

    return NextResponse.json(portfolio, { status: 201 })
  } catch (error) {
    console.error("Failed to create portfolio", error)
    return NextResponse.json(
      { error: "Failed to create portfolio" },
      { status: 500 }
    )
  }
}
