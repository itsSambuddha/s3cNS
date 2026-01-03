// app/api/gazette/list/route.ts
import { NextResponse } from "next/server"
import { getGazetteIssues } from "@/lib/gazette"

export async function GET() {
  try {
    const issues = getGazetteIssues().map((issue) => {
      const fileName = issue.filePath.split("/").pop() || ""
      return { ...issue, fileName }
    })
    return NextResponse.json({ issues })
  } catch (err: any) {
    console.error("GET /api/gazette/list error", err)
    return NextResponse.json({ issues: [] }, { status: 500 })
  }
}
