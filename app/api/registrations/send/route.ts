import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { DelegateRegistration } from "@/lib/db/models/DelegateRegistration"
import { sendDAInterestEmail } from "@/lib/email/sendDAEmail"

type Channel = "email" | "whatsapp"

export async function POST(req: Request) {
  try {
    const { registrationId, channel } = await req.json()

    await connectToDatabase()

    const reg = await DelegateRegistration.findById(registrationId)
    if (!reg) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 },
      )
    }

    if (channel === "email") {
      if (!reg.emailSent) {
        await sendDAInterestEmail({
          to: reg.email,
          fullName: reg.fullName,
          eventName: reg.eventType.replace("_", " "),
        })

        reg.emailSent = true
        await reg.save()
      }
    }

    if (channel === "whatsapp") {
      if (!reg.whatsappSent) {
        reg.whatsappSent = true
        await reg.save()
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[DA_SEND_ERROR]", err)
    return NextResponse.json(
      { success: false, error: "Send failed" },
      { status: 500 },
    )
  }
}
