// app/api/da/overview/route.ts
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { DelegateRegistration } from "@/lib/db/models/DelegateRegistration"

export async function GET() {
  try {
    await connectToDatabase()

    const [
      totalRegistrations,
      interestCount,
      emailSent,
      whatsappSent,
      registrationLinksSent,
    ] = await Promise.all([
      DelegateRegistration.countDocuments({}),
      DelegateRegistration.countDocuments({
        interestType: { $exists: true },
      }),
      DelegateRegistration.countDocuments({ emailSent: true }),
      DelegateRegistration.countDocuments({ whatsappSent: true }),
      DelegateRegistration.countDocuments({
        $or: [
          { delegateFormLinkSent: true },
          { ambassadorFormLinkSent: true },
        ],
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalRegistrations,
        interestCount,
        registrationLinksSent,
        emailSent,
        whatsappSent,
      },
    })
  } catch (err) {
    console.error("[DA_OVERVIEW_ERROR]", err)
    return NextResponse.json(
      { success: false, error: "Failed to load overview" },
      { status: 500 },
    )
  }
}
