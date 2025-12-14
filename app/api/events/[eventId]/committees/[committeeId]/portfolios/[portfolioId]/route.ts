import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { Portfolio } from "@/lib/db/models/Portfolio"

export async function DELETE(
  req: Request,
  {
    params,
  }: { params: { eventId: string; committeeId: string; portfolioId: string } }
) {
  try {
    await connectToDatabase()
    const portfolio = await Portfolio.findById(params.portfolioId)

    if (!portfolio || portfolio.isTaken) {
      return NextResponse.json(
        { error: "Cannot delete taken or non-existent portfolio" },
        { status: 400 }
      )
    }

    await Portfolio.deleteOne({ _id: params.portfolioId })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete portfolio", error)
    return NextResponse.json(
      { error: "Failed to delete portfolio" },
      { status: 500 }
    )
  }
}
