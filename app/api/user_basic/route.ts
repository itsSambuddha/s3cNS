// app/api/user-basic/route.ts
import { NextResponse } from "next/server"
import { connectToDatabase } from '@/lib/db/connect'
import { User } from "@/lib/db/models/User" // must include firebaseUid, role, secretariatRole, avatarUrl

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const uid = searchParams.get("uid")
  if (!uid) {
    return NextResponse.json({ user: null }, { status: 400 })
  }

  await connectToDatabase()

  const doc = await User.findOne({ firebaseUid: uid })
    .select("role secretariatRole avatarUrl")
    .lean()

  return NextResponse.json({ user: doc ?? null })
}
