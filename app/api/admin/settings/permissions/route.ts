// app/api/admin/settings/permissions/route.ts
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/connect"
import { User } from "@/lib/db/models/User"

type PermissionUpdateBody = {
  userId?: string
  canManageMembers?: boolean
  canApproveUSG?: boolean
  canManageFinance?: boolean
  canManageEvents?: boolean
}

// GET: list users with permissions
export async function GET() {
  try {
    await connectToDatabase()

    const users = await User.find({})
      .select(
        "displayName email secretariatRole office memberStatus role canManageMembers canApproveUSG canManageFinance canManageEvents",
      )
      .lean()

    return NextResponse.json({ users })
  } catch (err: any) {
    console.error("GET /api/admin/settings/permissions error", err)
    return NextResponse.json(
      { error: "Failed to load permissions" },
      { status: 500 },
    )
  }
}

// PATCH: update permission flags for a single user
export async function PATCH(req: Request) {
  try {
    await connectToDatabase()

    const body = (await req.json()) as PermissionUpdateBody
    const {
      userId,
      canManageMembers,
      canApproveUSG,
      canManageFinance,
      canManageEvents,
    } = body

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 },
      )
    }

    const update: Record<string, unknown> = {}

    if (typeof canManageMembers === "boolean") {
      update.canManageMembers = canManageMembers
    }
    if (typeof canApproveUSG === "boolean") {
      update.canApproveUSG = canApproveUSG
    }
    if (typeof canManageFinance === "boolean") {
      update.canManageFinance = canManageFinance
    }
    if (typeof canManageEvents === "boolean") {
      update.canManageEvents = canManageEvents
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { error: "No permission fields to update" },
        { status: 400 },
      )
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: update },
      { new: true, lean: true },
    ).select(
      "displayName email secretariatRole office memberStatus role canManageMembers canApproveUSG canManageFinance canManageEvents",
    )

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: updated })
  } catch (err: any) {
    console.error("PATCH /api/admin/settings/permissions error", err)
    return NextResponse.json(
      { error: "Failed to update permissions" },
      { status: 500 },
    )
  }
}
