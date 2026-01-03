// lib/gazette.ts
import fs from "node:fs"
import path from "node:path"

export type GazetteIssue = {
  id: string
  title: string
  subtitle: string
  date: string
  theme: string
  filePath: string
  isLatest: boolean
  readingTime: string
}

const GAZETTE_DIR = path.join(process.cwd(), "public", "gazette")

// map your real filenames -> nice metadata
const MANUAL_METADATA: Record<string, Partial<GazetteIssue>> = {
  "THE_EDMUNDIAN_TIMES_001.pdf": {
    title: "Volume I, Issue I",
    subtitle: "Foundations & Mandate",
    theme: "Rebuilding the Secretariat, codifying structure",
    readingTime: "8 min",
  },
  "THE_EDMUNDIAN_TIMES_002.pdf": {
    title: "Volume I, Issue II",
    subtitle: "Conference Operations Edition",
    theme: "Logistics, conference management, and finances",
    readingTime: "10 min",
  },
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  })
}

export function getGazetteIssues(): GazetteIssue[] {
  if (!fs.existsSync(GAZETTE_DIR)) return []

  const files = fs
    .readdirSync(GAZETTE_DIR)
    .filter((f) => f.toLowerCase().endsWith(".pdf"))

  const issues: GazetteIssue[] = files.map((filename) => {
    const fullPath = path.join(GAZETTE_DIR, filename)
    const stats = fs.statSync(fullPath)

    const base = filename.replace(/\.pdf$/i, "")
    const id = base
    const filePath = `/gazette/${filename}`

    const manual = MANUAL_METADATA[filename] ?? {}

    const fallbackTitle = base
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())

    const date = formatDate(stats.birthtime ?? stats.mtime)

    const issue: GazetteIssue = {
      id,
      title: manual.title ?? fallbackTitle,
      subtitle: manual.subtitle ?? "SECMUN Gazette issue",
      date,
      theme: manual.theme ?? "Official newsletter of SECMUN.",
      filePath,
      isLatest: false,
      readingTime: manual.readingTime ?? "10 min",
    }

    return issue
  })

  // newest first by creation time
  issues.sort((a, b) => {
    const aStats = fs.statSync(path.join(GAZETTE_DIR, `${a.id}.pdf`))
    const bStats = fs.statSync(path.join(GAZETTE_DIR, `${b.id}.pdf`))
    return bStats.birthtimeMs - aStats.birthtimeMs
  })

  if (issues[0]) issues[0].isLatest = true

  return issues
}
