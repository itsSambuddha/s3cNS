// app/api/admin/secretariat/senior/route.ts
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/connect"
import { User } from "@/lib/db/models/User"
import { getCurrentUser } from "@/lib/auth/getCurrentUser"

export async function GET() {
  try {
    await connectToDatabase()

    const current = await getCurrentUser()
    if (!current || !current.canManageEvents) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const leaders = await User.find({
      secretariatRole: {
        $in: ["PRESIDENT", "SECRETARY_GENERAL", "DIRECTOR_GENERAL"],
      },
      memberStatus: "ACTIVE",
    })
      .select("displayName email secretariatRole")
      .lean()

    const eligible = await User.find({
      memberStatus: "ACTIVE",
    })
      .select("displayName email secretariatRole")
      .lean()

    return NextResponse.json({ leaders, eligible })
  } catch (err: any) {
    console.error("GET /api/admin/secretariat/senior error", err)
    return NextResponse.json(
      { error: "Failed to load senior secretariat" },
      { status: 500 },
    )
  }
}

export async function PATCH(req: Request) {
  try {
    await connectToDatabase()

    const current = await getCurrentUser()
    if (!current || !current.canManageEvents) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      presidentId,
      secretaryGeneralId,
      directorGeneralId,
    } = body as {
      presidentId?: string | null
      secretaryGeneralId?: string | null
      directorGeneralId?: string | null
    }

    const updates: { role: string; userId?: string | null }[] = [
      { role: "PRESIDENT", userId: presidentId },
      { role: "SECRETARY_GENERAL", userId: secretaryGeneralId },
      { role: "DIRECTOR_GENERAL", userId: directorGeneralId },
    ]

    // Reset existing holders if they differ, then set new ones
    for (const { role, userId } of updates) {
      await User.updateMany(
        { secretariatRole: role },
        { $set: { secretariatRole: "USG" } },
      )

      if (userId) {
        await User.findByIdAndUpdate(userId, {
          $set: { secretariatRole: role, memberStatus: "ACTIVE" },
        })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("PATCH /api/admin/secretariat/senior error", err)
    return NextResponse.json(
      { error: "Failed to update senior secretariat" },
      { status: 500 },
    )
  }
}
