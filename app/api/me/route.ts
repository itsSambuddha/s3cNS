// app/api/me/route.ts
import { NextResponse } from "next/server"
import { getAuth } from "firebase-admin/auth"
import { connectToDatabase } from "@/lib/db/connect"
import { User } from "@/lib/db/models/User"

async function handleMe(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const idToken = authHeader.slice("Bearer ".length)
    const decoded = await getAuth().verifyIdToken(idToken)
    const uid = decoded.uid

    await connectToDatabase()

    const mongoUser = await User.findOne({ uid }).lean()
    if (!mongoUser) {
      return NextResponse.json({ user: null }, { status: 404 })
    }

    const user = {
      uid: mongoUser.uid,
      email: mongoUser.email,
      displayName: mongoUser.displayName,
      photoURL: mongoUser.photoURL,
      role: mongoUser.role,
      secretariatRole: mongoUser.secretariatRole,
      office: mongoUser.office,
      memberStatus: mongoUser.memberStatus,
      canManageMembers: mongoUser.canManageMembers,
      canApproveUSG: mongoUser.canApproveUSG,
      canManageFinance: mongoUser.canManageFinance,
      canManageEvents: mongoUser.canManageEvents,
      createdAt: mongoUser.createdAt,
      updatedAt: mongoUser.updatedAt,
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (err) {
    console.error("GET /api/me error", err)
    return NextResponse.json({ user: null }, { status: 500 })
  }
}

export async function GET(req: Request) {
  return handleMe(req)
}

export async function POST(req: Request) {
  return handleMe(req)
}
