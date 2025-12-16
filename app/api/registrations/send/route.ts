import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { DelegateRegistration } from "@/lib/db/models/DelegateRegistration"
import { sendDAInterestEmail } from "@/lib/email/sendDAEmail"

export async function POST(req: Request) {
  try {
    const { registrationId, channel } = await req.json()

    if (!registrationId || !channel) {
      return NextResponse.json(
        { success: false, error: "Missing parameters" },
        { status: 400 },
      )
    }

    await connectToDatabase()

    const registration = await DelegateRegistration.findById(registrationId).lean()

    if (!registration) {
      return NextResponse.json(
        { success: false, error: "Registration not found" },
        { status: 404 },
      )
    }

    /* =========================
       EMAIL FLOW
    ========================= */
    if (channel === "email") {
      await sendDAInterestEmail({
        to: registration.email,                     // ✅ FROM DB
        fullName: registration.fullName,             // ✅
        eventName: registration.eventType.replace("_", " "), // ✅
        interestType: registration.interestType!,    // ✅
        email: registration.email,                   // ✅
        phone: registration.whatsAppNumber,          // ✅
        submittedAt: registration.createdAt,          // ✅
      })

      await DelegateRegistration.findByIdAndUpdate(registrationId, {
        emailSent: true,
      })
    }

    /* =========================
       WHATSAPP FLOW
    ========================= */
    if (channel === "whatsapp") {
      await DelegateRegistration.findByIdAndUpdate(registrationId, {
        whatsappSent: true,
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[DA_SEND_ERROR]", err)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    )
  }
}
