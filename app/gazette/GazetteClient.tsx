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
            <div className="absolute left-[-15%] top-[-10%] h-64 w-64 rounded-full bg-blue-200/30 blur-3xl" />
            <div className="absolute right-[-10%] top-[35%] h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
            <div className="absolute bottom-0 left-[20%] h-52 w-52 rounded-full bg-indigo-200/25 blur-3xl" />
          </div>

          <div className="relative mx-auto w-full max-w-6xl px-4 pt-10 lg:px-6">
            {/* Hero */}
            <section className="mb-8 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
                SECMUN Gazette · 2025–26
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
                Gazette & Newsletter archive
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600">
                Browse officially published SECMUN Gazette issues in PDF format,
                designed for reference, archival use, and long-form reading.
              </p>
            </section>

            {/* Single column reading layout */}
            <section className="space-y-8 pb-10">
              {/* Featured / latest issue */}
              {latest && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 20 }}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur"
                >
                  <div className="border-b border-slate-100 px-5 pb-3 pt-4 sm:px-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600">
                        Featured issue
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        <span>{latest.date}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span>{latest.readingTime} read</span>
                      </div>
                    </div>
                    <h2 className="mt-2 text-lg font-semibold text-slate-900 sm:text-xl">
                      {latest.title}
                    </h2>
                    <p className="mt-1 text-[13px] text-slate-700">
                      {latest.subtitle}
                    </p>
                    <p className="mt-2 text-[12px] text-slate-500">
                      {latest.theme}
                    </p>
                  </div>

                  <div className="flex flex-col items-start justify-between gap-4 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
                    <div className="flex gap-3">
                      <Link
                        href={latest.filePath}
                        target="_blank"
                        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Open PDF</span>
                      </Link>
                      <a
                        href={latest.filePath}
                        download
                        className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-medium text-slate-800 hover:border-slate-400"
                      >
                        <ArrowDownToLine className="h-3.5 w-3.5" />
                        <span>Download</span>
                      </a>
                    </div>

                    {/* subtle reading animation pill */}
                    <motion.div
                      className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-medium text-sky-700"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inset-0 rounded-full bg-sky-500/80" />
                        <motion.span
                          className="absolute inset-0 rounded-full bg-sky-400/50"
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 1.8, 1] }}
                          transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeOut",
                          }}
                        />
                      </span>
                      <span>Readers are exploring this issue</span>
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
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: index * 0.04,
                      }}
                      whileHover={{ y: -2 }}
                      className="group flex items-stretch justify-between gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 text-xs shadow-sm"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                          <span className="uppercase tracking-[0.18em] text-slate-400">
                            {issue.date}
                          </span>
                          <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:inline-block" />
                          <span className="text-slate-500">
                            {issue.readingTime} read
                          </span>
                        </div>
                        <h4 className="mt-1 text-sm font-semibold text-slate-900">
                          {issue.title}
                        </h4>
                        <p className="mt-1 text-[12px] text-slate-700">
                          {issue.subtitle}
                        </p>
                        <p className="mt-2 text-[11px] text-slate-500">
                          {issue.theme}
                        </p>
                      </div>

                      <div className="flex flex-col items-end justify-between gap-2 sm:w-40">
                        <Link
                          href={issue.filePath}
                          target="_blank"
                          className="relative inline-flex w-full items-center justify-center gap-1 rounded-full bg-slate-900/95 px-3 py-1 text-[11px] font-semibold text-slate-50"
                        >
                          <FileText className="h-3 w-3" />
                          <span className="relative">
                            Read
                          </span>
                        </Link>
                        <a
                          href={issue.filePath}
                          download
                          className="inline-flex w-full items-center justify-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-medium text-slate-800 hover:border-slate-400"
                        >
                          <ArrowDownToLine className="h-3 w-3" />
                          <span>Download</span>
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
