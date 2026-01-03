// app/api/admin/gazette/delete/route.ts
import { NextResponse } from "next/server"
import fs from "node:fs"
import path from "node:path"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const fileName = body.fileName as string | undefined

    if (!fileName) {
      return NextResponse.json(
        { error: "Missing fileName" },
        { status: 400 },
      )
    }

    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_")
    const filePath = path.join(process.cwd(), "public", "gazette", safeName)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 },
      )
    }

    fs.unlinkSync(filePath)

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("POST /api/admin/gazette/delete error", err)
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 },
    )
  }
}
