// app/api/registrations/interest/route.ts

import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { DelegateRegistration } from "@/lib/db/models/DelegateRegistration"
import { Event } from "@/lib/db/models/Event"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      eventType,
      eventId,
      interestType,
      fullName,
      email,
      whatsAppNumber,
    } = body as {
      eventType?: string
      eventId?: string | null
      interestType?: string
      fullName?: string
      email?: string
      whatsAppNumber?: string
    }

    console.log("📥 Incoming registration payload:", body)

    // presence validation
    if (!eventType) {
      return NextResponse.json(
        { error: "eventType is required", code: "MISSING_EVENT_TYPE" },
        { status: 400 },
      )
    }
    if (!interestType) {
      return NextResponse.json(
        { error: "interestType is required", code: "MISSING_INTEREST_TYPE" },
        { status: 400 },
      )
    }
    if (!fullName || fullName.trim() === "") {
      return NextResponse.json(
        { error: "fullName is required", code: "MISSING_FULL_NAME" },
        { status: 400 },
      )
    }
    if (!email || email.trim() === "") {
      return NextResponse.json(
        { error: "email is required", code: "MISSING_EMAIL" },
        { status: 400 },
      )
    }
    if (!whatsAppNumber || whatsAppNumber.trim() === "") {
      return NextResponse.json(
        { error: "whatsAppNumber is required", code: "MISSING_WHATSAPP" },
        { status: 400 },
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format", code: "INVALID_EMAIL" },
        { status: 400 },
      )
    }

    const phoneDigitsOnly = whatsAppNumber.replace(/\D/g, "")
    if (phoneDigitsOnly.length < 10 || phoneDigitsOnly.length > 15) {
      return NextResponse.json(
        {
          error: "Phone number must be between 10 and 15 digits",
          code: "INVALID_PHONE",
        },
        { status: 400 },
      )
    }

    const validEventTypes = ["INTRA_SECMUN", "INTER_SECMUN", "WORKSHOP", "EDBLAZON_TIMES"]
    const validInterestTypes = ["DELEGATE", "CAMPUS_AMBASSADOR"]

    if (!validEventTypes.includes(eventType)) {
      return NextResponse.json(
        {
          error: `Invalid eventType. Must be one of: ${validEventTypes.join(", ")}`,
          code: "INVALID_EVENT_TYPE",
        },
        { status: 400 },
      )
    }
    if (!validInterestTypes.includes(interestType)) {
      return NextResponse.json(
        {
          error: `Invalid interestType. Must be one of: ${validInterestTypes.join(", ")}`,
          code: "INVALID_INTEREST_TYPE",
        },
        { status: 400 },
      )
    }

    await connectToDatabase()

    // resolve event: prefer eventId, then fallback to latest REG_OPEN by type
    let event = null

    if (eventId) {
      console.log("🔎 Looking up event by id:", { eventId, eventType })
      event = await Event.findOne({ _id: eventId, type: eventType }).select(
        "_id name type status",
      )
    }

    if (!event) {
      console.log("🔎 Looking up latest REG_OPEN event by type:", { eventType })
      event = await Event.findOne({
        type: eventType,
        status: "REG_OPEN",
      })
        .sort({ createdAt: -1 })
        .select("_id name type status")
    }

    console.log("🧠 Event lookup result:", event)

    if (!event) {
      return NextResponse.json(
        {
          error: "Event not found or registrations are closed for this event type",
          code: "EVENT_NOT_FOUND",
          details: { eventType, status: "REG_OPEN" },
        },
        { status: 404 },
      )
    }

    const existingRegistration = await DelegateRegistration.findOne({
      eventId: event._id,
      email: email.toLowerCase(),
    })

    if (existingRegistration) {
      return NextResponse.json(
        {
          error: "You have already registered for this event",
          code: "ALREADY_REGISTERED",
          id: existingRegistration._id,
        },
        { status: 409 },
      )
    }

    const registration = await DelegateRegistration.create({
      eventId: event._id,
      eventType,
      interestType,
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      whatsAppNumber: whatsAppNumber.trim(),
      status: "APPLIED",
      emailSent: false,
      whatsappSent: false,
      registrationEmailSent: false,
      registrationWhatsappSent: false,
    })

    console.log(`✅ New registration created: ${registration._id}`)

    return NextResponse.json(
      {
        success: true,
        id: registration._id,
        message: "Interest registered successfully. We'll contact you soon!",
      },
      { status: 201 },
    )
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err)
    console.error("❌ INTEREST_REG_ERROR:", error)
    return NextResponse.json(
      {
        error: "Internal server error while processing registration",
        code: "INTERNAL_ERROR",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 },
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")
    const eventType = searchParams.get("eventType")

    if (!email || !eventType) {
      return NextResponse.json(
        { error: "email and eventType query parameters required" },
        { status: 400 },
      )
    }

    await connectToDatabase()

    const registration = await DelegateRegistration.findOne({
      email: email.toLowerCase(),
      eventType,
    }).select("status createdAt")

    if (!registration) {
      return NextResponse.json(
        { found: false, message: "No registration found" },
        { status: 404 },
      )
    }

    return NextResponse.json({
      found: true,
      status: registration.status,
      registeredAt: registration.createdAt,
    })
  } catch (err) {
    console.error("GET registration error:", err)
    return NextResponse.json(
      { error: "Failed to fetch registration status" },
      { status: 500 },
    )
  }
}
