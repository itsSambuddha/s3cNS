// app/api/admin/secretariat/member/route.ts
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/connect"
import { User } from "@/lib/db/models/User"
import { getCurrentUser } from "@/lib/auth/getCurrentUser"

export async function PATCH(req: Request) {
  try {
    await connectToDatabase()

    const current = await getCurrentUser()
    if (!current || !current.canManageEvents) {
      // adjust to your own admin flag, e.g. current.isAdmin
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const {
      userId,
      secretariatRole,
      office,
      memberStatus,
      canManageFinance,
      canManageEvents,
    } = body as {
      userId?: string
      secretariatRole?: string
      office?: string | null
      memberStatus?: string
      canManageFinance?: boolean
      canManageEvents?: boolean
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 },
      )
    }

    const update: any = {}

    if (typeof secretariatRole === "string") {
      update.secretariatRole = secretariatRole
    }
    if (typeof office !== "undefined") {
      update.office = office ?? null
    }
    if (typeof memberStatus === "string") {
      update.memberStatus = memberStatus
    }
    if (typeof canManageFinance === "boolean") {
      update.canManageFinance = canManageFinance
    }
    if (typeof canManageEvents === "boolean") {
      update.canManageEvents = canManageEvents
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      )
    }

    const updated = await User.findByIdAndUpdate(userId, update, {
      new: true,
      lean: true,
    }).select(
      "displayName email secretariatRole office academicDepartment year memberStatus canManageFinance canManageEvents",
    )

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ member: updated })
  } catch (err: any) {
    console.error("PATCH /api/admin/secretariat/member error", err)
    return NextResponse.json(
      { error: "Failed to update member" },
      { status: 500 },
    )
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase()

    const current = await getCurrentUser()
    if (!current || !current.canManageEvents) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 },
      )
    }

    const deleted = await User.findByIdAndDelete(userId).lean()
    if (!deleted) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("DELETE /api/admin/secretariat/member error", err)
    return NextResponse.json(
      { error: "Failed to delete member" },
      { status: 500 },
    )
  }
}
