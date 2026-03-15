// app/api/secretariat/members/route.ts
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/connect"
import { User } from "@/lib/db/models/User"
import { Device } from "@/lib/db/models/Device"

export async function GET(req: Request) {
  await connectToDatabase()

  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") || ""
  const role = searchParams.get("role") || ""
  const office = searchParams.get("office") || ""
  const dept = searchParams.get("dept") || ""
  const year = searchParams.get("year") || ""

  const view = searchParams.get("view") || ""
  const filter: any = {}

  if (view === "active") filter.memberStatus = "ACTIVE"
  else if (view === "inactive") filter.memberStatus = { $ne: "ACTIVE" }
  else if (view === "applicants") filter.memberStatus = "APPLICANT"

  if (role) filter.secretariatRole = role
  if (office) filter.office = office
  if (dept) filter.academicDepartment = dept
  if (year) filter.year = year

  if (q) {
    filter.$or = [
      { displayName: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ]
  }

  const members = await User.find(filter)
    .select(
      "_id displayName email phone secretariatRole office academicDepartment year rollNo memberStatus canManageFinance canManageEvents photoURL",
    )
    .sort({ secretariatRole: 1, office: 1, displayName: 1 })
    .lean()
    .exec()

  // Find all active devices for these users
  const activeDevices = await Device.find({
    userId: { $in: members.map(m => m._id) },
    isActive: true
  }).select('userId').lean()

  const pushEnabledUserIds = new Set(activeDevices.map(d => String(d.userId)))

  // Map to include a boolean hasPushEnabled
  const membersWithPush = members.map(m => ({
    ...m,
    hasPushEnabled: pushEnabledUserIds.has(String(m._id))
  }))

  return NextResponse.json({ members: membersWithPush })
}
