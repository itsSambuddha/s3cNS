// app/api/admin/health/route.ts
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/connect"
import { User } from "@/lib/db/models/User"
import nodemailer from "nodemailer"

export async function GET() {
  const dbStatus = {
    ok: false,
    message: "Unknown",
  }
  const emailStatus = {
    ok: false,
    message: "Not checked",
  }
  const storageStatus = {
    ok: true,
    usedMb: 0,
  }

  // 1) DB health: simple ping via a lightweight query
  try {
    await connectToDatabase()
    await User.findOne({}).select("_id").lean()
    dbStatus.ok = true
    dbStatus.message = "Connected"
  } catch (e: any) {
    console.error("Health DB error", e)
    dbStatus.ok = false
    dbStatus.message = "DB error"
  }

  // 2) Email health: optional quick config check (no real send)
  try {
    const host = process.env.SMTP_HOST
    const user = process.env.SMTP_USER
    if (host && user) {
      const transporter = nodemailer.createTransport({
        host,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: {
          user,
          pass: process.env.SMTP_PASS,
        },
      })
      await transporter.verify()
      emailStatus.ok = true
      emailStatus.message = "SMTP reachable"
    } else {
      emailStatus.ok = false
      emailStatus.message = "SMTP not configured"
    }
  } catch (e: any) {
    console.error("Health SMTP error", e)
    emailStatus.ok = false
    emailStatus.message = "SMTP error"
  }

  // 3) Storage health: placeholder, you can wire in actual usage later
  storageStatus.ok = true
  storageStatus.usedMb = 0

  return NextResponse.json({
    db: dbStatus,
    email: emailStatus,
    storage: storageStatus,
  })
}
