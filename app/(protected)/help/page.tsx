// app/(protected)/help/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Footer from '@/components/layout/Footer'

type Section = {
  id: string
  title: string
  badge: string
  short: string
  body: string
}

const sections: Section[] = [
  {
    id: 'finance',
    title: 'Finance',
    badge: 'Budgets • Expenses • Proposals',
    short: 'Design event budgets, log expenses, and email polished finance proposals.',
    body: `
The Finance module helps the Secretariat manage event budgets, expenses, and finance proposals.

• Budgets: Design per‑event budgets and track line items.
• Records: View expenses and export them to CSV or print.
• Proposals: Turn a budget into a finance proposal and send it via email to stakeholders.
`,
  },
//   {
//     id: 'attendance',
//     title: 'Attendance',
//     badge: 'Committees • Events',
//     short: 'Mark attendance for committees and events with export‑ready logs.',
//     body: `
// The Attendance module is used to track committee and event attendance.

// • Mark attendance for sessions.
// • Export attendance data for reports or reimbursements.
// `,
//   },
  {
    id: 'events',
    title: 'Events',
    badge: 'Timelines • Committees',
    short: 'See every SECMUN event in one place with dates, venues, and links.',
    body: `
The Events module keeps SECMUN events organised.

• Store core details like dates, venues, and committees.
• Link other modules (Finance, Attendance, Documents) to specific events.
`,
  },
  {
    id: 'documents',
    title: 'Documents',
    badge: 'Library • Files',
    short: 'A shared drive for circulars, allotments, and internal references.',
    body: `
The Documents module is the internal file library for SECMUN.

• Upload and organise circulars, allotment matrices, and reference files.
• Keep everything in one place for the Secretariat.
`,
  },
  {
    id: 'admin',
    title: 'Admin & Auth',
    badge: 'Roles • Offices',
    short: 'Control access with offices, secretariat roles, and permissions.',
    body: `
Admin and Auth control who can access which parts of the platform.

• Manage user accounts, offices, and secretariat roles.
• Restrict Finance and other sensitive modules to authorised members only.
`,
  },
]

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

export default function HelpPage() {
  const [activeId, setActiveId] = useState<string>('finance')

  const fullText = sections.map((s) => s.title + '\n' + s.body).join('\n\n')
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const active = sections.find((s) => s.id === activeId) ?? sections[0]

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
    <motion.div
      className="space-y-7"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      {/* Hero */}
      <motion.div
        variants={fadeInUp}
        className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-slate-950 via-slate-900 to-sky-900 px-5 py-6 text-slate-50 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.9)]"
      >
        {/* Glow layers */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-0 h-40 w-40 rounded-full bg-sky-500/40 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-44 w-44 rounded-full bg-blue-400/30 blur-3xl" />
          <div className="absolute inset-x-10 top-1/2 h-32 rounded-full bg-slate-800/30 blur-2xl" />
        </div>

        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.3fr),minmax(0,1fr)]">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-200/80">
              Help & docs
            </p>
            <h1 className="text-2xl font-semibold sm:text-[1.7rem]">
              SECMUN control room, explained.
            </h1>
            <p className="max-w-xl text-xs text-slate-200/90 sm:text-sm">
              Fly over every core module of the platform. Hover the tiles to see what
              each area does, and use Gemini to condense everything into a quick brief
              when you are onboarding someone new.
            </p>

            <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
              <Chip>Blue‑room inspired UI</Chip>
              <Chip>Module‑aware docs</Chip>
              <Chip>Gemini‑powered summary</Chip>
            </div>
          </div>

          {/* Gemini summary panel */}
          <Card className="relative overflow-hidden rounded-2xl border border-sky-400/40 bg-slate-950/80 p-4 text-xs text-slate-50 shadow-lg">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#38bdf833,_transparent_55%),radial-gradient(circle_at_bottom,_#0ea5e933,_transparent_55%)]" />
            <div className="relative space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-200">
                    Summarise using Gemini
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-300">
                    Summarises only this Help page into 2–3 sentences. No general chat.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={handleSummarise}
                  disabled={loading}
                  className="flex items-center gap-1 rounded-full bg-sky-400 px-3 py-1 text-[11px] font-medium text-slate-950 hover:bg-sky-300"
                >
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

              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-sky-300/50 bg-sky-50/90 p-3 text-[11px] leading-relaxed text-slate-900"
              >
                {error && <span className="text-rose-600">{error}</span>}
                {!error && summary && <span>{summary}</span>}
                {!error && !summary && (
                  <span>
                    Click <span className="font-semibold">Summarise</span> to get a
                    micro-brief of all modules. Great for quick walkthroughs and
                    onboarding decks.
                  </span>
                )}
              </motion.div>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Middle row: interactive module explorer */}
      <motion.div
        variants={fadeInUp}
        className="grid gap-4 md:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)]"
      >
        {/* Tiles */}
        <div className="grid gap-3 sm:grid-cols-2">
          {sections.map((section, idx) => {
            const active = section.id === activeId
            return (
              <motion.button
                key={section.id}
                type="button"
                onMouseEnter={() => setActiveId(section.id)}
                onClick={() => setActiveId(section.id)}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 0.04 * idx,
                  type: 'spring',
                  stiffness: 260,
                  damping: 22,
                }}
                className={cn(
                  'relative flex h-full flex-col items-start gap-1.5 rounded-2xl border px-3.5 py-3 text-left text-xs transition-all',
                  'bg-card/80 backdrop-blur hover:-translate-y-1 hover:shadow-lg',
                  active
                    ? 'border-sky-500 bg-slate-950 text-slate-50'
                    : 'border-border hover:border-sky-300/80',
                )}
              >
                {active && (
                  <motion.div
                    layoutId="blueGlow"
                    className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/30 via-slate-900/60 to-blue-700/40"
                  />
                )}

                <div className="relative flex w-full items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide">
                    {section.title}
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide',
                      active
                        ? 'bg-sky-300 text-slate-950'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {section.badge}
                  </span>
                </div>
                <p
                  className={cn(
                    'relative mt-1 text-[11px] leading-relaxed',
                    active ? 'text-slate-100' : 'text-muted-foreground',
                  )}
                >
                  {section.short}
                </p>
              </motion.button>
            )
          })}
          
          
        </div>

        {/* Detail view */}
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 230, damping: 24 }}
        >
          <Card className="h-full rounded-2xl border bg-card/80 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Module focus
                </p>
                <h2 className="text-sm font-semibold">{active.title}</h2>
              </div>
              <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-sky-800">
                {active.badge}
              </span>
            </div>
            <p className="mt-2 whitespace-pre-line text-[11px] leading-relaxed text-muted-foreground">
              {active.body}
            </p>
            
          </Card>
        </motion.div>
      </motion.div>
          <Footer />
    </motion.div>
    
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-sky-400/60 bg-sky-500/20 px-2 py-0.5 text-[10px] font-medium text-sky-100 backdrop-blur">
      {children}
      
    </span>

  )
}

