// app/api/admin/gazette/upload/route.ts
import { NextResponse } from "next/server"
import fs from "node:fs"
import path from "node:path"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 },
      )
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 },
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Ensure public/gazette exists
    const gazetteDir = path.join(process.cwd(), "public", "gazette")
    if (!fs.existsSync(gazetteDir)) {
      fs.mkdirSync(gazetteDir, { recursive: true })
    }

    // Basic sanitization of filename
    const originalName = file.name || "gazette.pdf"
    const safeName = originalName
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .replace(/\.pdf$/i, "") + ".pdf"

    const targetPath = path.join(gazetteDir, safeName)

    fs.writeFileSync(targetPath, buffer)

    return NextResponse.json({
      ok: true,
      fileName: safeName,
      publicPath: `/gazette/${safeName}`,
    })
  } catch (err: any) {
    console.error("Gazette upload error", err)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    )
  }
}
