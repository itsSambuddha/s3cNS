// app/api/secretariat/members/route.ts
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/connect"
import { User } from "@/lib/db/models/User"

export async function GET(req: Request) {
  await connectToDatabase()

  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") || ""
  const role = searchParams.get("role") || ""
  const office = searchParams.get("office") || ""
  const dept = searchParams.get("dept") || ""
  const year = searchParams.get("year") || ""

  const filter: any = { memberStatus: "ACTIVE" }

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
      "displayName email phone secretariatRole office academicDepartment year rollNo memberStatus canManageFinance canManageEvents",
    )
    .sort({ secretariatRole: 1, office: 1, displayName: 1 })
    .lean()
    .exec()

  return NextResponse.json({ members })
}
