// app/api/secretariat/usg/route.ts
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/connect"
import { User } from "@/lib/db/models/User"

export async function GET() {
  try {
    await connectToDatabase()

    // fetch only secretariat users that are USG or deputies
    const users = await User.find({
      secretariatRole: "USG",
      // optionally also filter by ACTIVE:
      memberStatus: "ACTIVE",
      office: { $ne: null },
    })
      .select("displayName academicDepartment year office photoURL")
      .lean()

    // normalize to what SecretariatMembersShowcase expects
    const usgUsers = users.map((u: any) => ({
      _id: String(u._id),
      displayName: u.displayName,
      academicDepartment: u.academicDepartment,
      year: u.year,
      office: u.office,      // must match keys in `secretariatMembers`
      photoURL: u.photoURL,
    }))

    return NextResponse.json({ users: usgUsers }, { status: 200 })
  } catch (e) {
    console.error("GET /api/secretariat/usg error", e)
    return NextResponse.json({ users: [] }, { status: 500 })
  }
}
