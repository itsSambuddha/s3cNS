// app/gazette/GazetteClient.tsx
"use client"

import Link from "next/link"
import { useMemo } from "react"
import { motion } from "motion/react"
import { ArrowDownToLine, FileText } from "lucide-react"
import Sidebar from "@/components/layout/Sidebar"
import Navbar from "@/components/layout/Navbar"
import type { GazetteIssue } from "@/lib/gazette"

export default function GazetteClient({ issues }: { issues: GazetteIssue[] }) {
  const latest = useMemo(() => issues.find((i) => i.isLatest), [issues])
  const archive = useMemo(
    () => issues.filter((i) => !i.isLatest),
    [issues],
  )

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />

        <main className="relative flex-1 overflow-hidden px-3 pt-4 pb-0 sm:px-6 sm:pt-6 sm:pb-0">
          {/* background gradient like constitution */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-[-15%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-[120px]" />
            <div className="absolute right-[-10%] top-[35%] h-[600px] w-[600px] rounded-full bg-sky-100/40 blur-[140px]" />
            <div className="absolute bottom-0 left-[20%] h-[400px] w-[400px] rounded-full bg-indigo-100/30 blur-[100px]" />
            {/* Grainy Texture */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3BaseFilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/baseFilter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
          </div>

          <div className="relative mx-auto w-full max-w-6xl px-4 pt-10 lg:px-6">
            {/* Hero */}
            <section className="mb-16 text-center space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">
                Institutional Memory
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl dark:text-white">
                Gazette & Archive
              </h1>
              <p className="mx-auto max-w-2xl text-lg font-medium text-slate-500 leading-relaxed dark:text-zinc-400">
                Browse officially published SECMUN Gazette issues in PDF format,
                designed for reference, archival use, and long-form reading.
              </p>
            </section>

            {/* Single column reading layout */}
            <section className="space-y-8 pb-10">
              {/* Featured / latest issue */}
              {latest && (
                <motion.section
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-[0_32px_80px_-16px_rgba(15,23,42,0.1)] dark:border-white/10 dark:bg-zinc-900"
                >
                  <div className="border-b border-slate-100 p-8 sm:p-10 dark:border-white/5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600">
                          Latest Release
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400">
                        <span>{latest.date}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-200" />
                        <span>{latest.readingTime} read</span>
                      </div>
                    </div>
                    <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                      {latest.title}
                    </h2>
                    <p className="mt-3 text-lg font-medium text-slate-600 leading-relaxed dark:text-zinc-400">
                      {latest.subtitle}
                    </p>
                    <div className="mt-6 inline-flex rounded-xl bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500 dark:bg-white/5">
                      {latest.theme}
                    </div>
                  </div>

                  <div className="flex flex-col items-start justify-between gap-6 bg-slate-50/50 p-8 sm:flex-row sm:items-center sm:p-10 dark:bg-white/5">
                    <div className="flex gap-4">
                      <Link
                        href={latest.filePath}
                        target="_blank"
                        className="inline-flex items-center gap-3 rounded-full bg-slate-900 px-6 py-3 text-sm font-black text-white shadow-lg shadow-slate-900/10 transition-transform hover:scale-[1.03] dark:bg-white dark:text-slate-900"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Read Issue</span>
                      </Link>
                      <a
                        href={latest.filePath}
                        download
                        className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-900 shadow-sm transition-transform hover:scale-[1.03] dark:bg-white/5 dark:border-white/10 dark:text-white"
                      >
                        <ArrowDownToLine className="h-4 w-4" />
                        <span>Download</span>
                      </a>
                    </div>

                    <motion.div
                      className="inline-flex items-center gap-3 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-2 text-xs font-black uppercase tracking-wider text-blue-700"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping" />
                        <span className="relative rounded-full bg-blue-500 h-2 w-2" />
                      </span>
                      <span>Authorized for internal reading</span>
                    </motion.div>
                  </div>
                </motion.section>
              )}

              {/* Archive heading */}
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  All issues
                </h3>
                <p className="text-[11px] text-slate-500">
                  Tap any issue to open the PDF in a new tab.
                </p>
              </div>

              {/* Archive list */}
              {archive.length === 0 ? (
                <p className="text-sm text-slate-500">
                  New issues will appear here as they are published.
                </p>
              ) : (
                <div className="space-y-3">
                  {archive.map((issue, index) => (
                    <motion.article
                      key={issue.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.05,
                      }}
                      whileHover={{ y: -4 }}
                      className="group flex flex-col items-stretch justify-between gap-6 rounded-3xl border border-slate-200 bg-white p-6 transition-all hover:shadow-xl hover:shadow-blue-500/5 sm:flex-row dark:border-white/5 dark:bg-white/5"
                    >
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                          <span>{issue.date}</span>
                          <span className="h-1 w-1 rounded-full bg-slate-200" />
                          <span>{issue.readingTime} read</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors dark:text-white dark:group-hover:text-blue-400">
                            {issue.title}
                          </h4>
                          <p className="mt-2 text-sm font-medium text-slate-500 leading-relaxed dark:text-zinc-400">
                            {issue.subtitle}
                          </p>
                        </div>
                        <div className="inline-flex rounded-lg bg-slate-50 px-3 py-1 text-[10px] font-bold text-slate-400 dark:bg-white/5">
                          {issue.theme}
                        </div>
                      </div>

                      <div className="flex flex-row items-center gap-3 sm:flex-col sm:items-end sm:justify-center sm:w-48">
                        <Link
                          href={issue.filePath}
                          target="_blank"
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-black text-white transition-opacity hover:opacity-90 sm:w-full dark:bg-white dark:text-slate-900"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span>Read</span>
                        </Link>
                        <a
                          href={issue.filePath}
                          download
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-black text-slate-900 transition-colors hover:bg-slate-50 sm:w-full dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
                        >
                          <ArrowDownToLine className="h-3.5 w-3.5" />
                          <span>PDF</span>
                        </a>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
