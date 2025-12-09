// app/(protected)/help/page.tsx
'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const sections = [
  {
    id: 'finance',
    title: 'Finance module',
    body: `
The Finance module helps the Secretariat manage event budgets, expenses, and finance proposals.

• Budgets: Design per‑event budgets and track line items.
• Records: View expenses and export them to CSV or print.
• Proposals: Turn a budget into a finance proposal and send it via email to stakeholders.
`,
  },
//   {
//     id: 'attendance',
//     title: 'Attendance module',
//     body: `
// The Attendance module is used to track committee and event attendance.

// • Mark attendance for sessions.
// • Export attendance data for reports or reimbursements.
// `,
//   },
  {
    id: 'events',
    title: 'Events module',
    body: `
The Events module keeps SEC‑MUN events organised.

• Store core details like dates, venues, and committees.
• Link other modules (Finance, Attendance, Documents) to specific events.
`,
  },
  {
    id: 'documents',
    title: 'Documents module',
    body: `
The Documents module is the internal file library for SEC‑MUN.

• Upload and organise circulars, allotment matrices, and reference files.
• Keep everything in one place for the Secretariat.
`,
  },
  {
    id: 'admin',
    title: 'Admin & Auth',
    body: `
Admin and Auth control who can access which parts of the platform.

• Manage user accounts, offices, and secretariat roles.
• Restrict Finance and other sensitive modules to authorised members only.
`,
  },
]

export default function HelpPage() {
  const fullText = sections.map((s) => s.title + '\n' + s.body).join('\n\n')

  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSummarise = async () => {
    try {
      setLoading(true)
      setError(null)
      setSummary(null)

      const res = await fetch('/api/docs/summarise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: fullText }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to summarise')

      setSummary(json.summary as string)
    } catch (e: any) {
      setError(e?.message || 'Could not generate summary')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Help & docs
        </p>
        <h1 className="text-xl font-semibold sm:text-2xl">
          Using the SEC‑MUN platform
        </h1>
        <p className="text-sm text-muted-foreground">
          Read an overview of each module, or generate a short summary with Gemini.
        </p>
      </div>

      {/* Summarise using Gemini */}
      <Card className="flex flex-col gap-2 rounded-2xl border bg-card/80 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Summarise using Gemini
            </p>
            <p className="text-xs text-muted-foreground">
              Get a short overview of all modules on this page.
            </p>
          </div>
          <Button size="sm" onClick={handleSummarise} disabled={loading} className="flex items-center gap-2">
  <Image
    src="/logo/gemini-color.svg"
    alt="Gemini"
    width={16}
    height={16}
    className="rounded-sm"
  />
  {loading ? 'Summarising…' : 'Summarise'}
</Button>
        </div>
        {error && (
          <p className="text-[11px] text-destructive">
            {error}
          </p>
        )}
        {summary && (
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {summary}
          </p>
        )}
      </Card>

      {/* Static sections */}
      <div className="grid gap-4 lg:grid-cols-2">
        {sections.map((section) => (
          <Card
            key={section.id}
            className="rounded-2xl border bg-card/80 p-4 shadow-sm"
          >
            <h2 className="text-sm font-semibold">{section.title}</h2>
            <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
              {section.body}
            </p>
          </Card>
        ))}
      </div>
    </div>
  )
}
