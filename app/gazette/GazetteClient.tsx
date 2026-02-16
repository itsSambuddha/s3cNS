// app/gazette/GazetteClient.tsx
"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { ArrowDownToLine, FileText, Clock, ExternalLink, ShieldAlert, Newspaper } from "lucide-react"
import Sidebar from "@/components/layout/Sidebar"
import Navbar from "@/components/layout/Navbar"
import type { GazetteIssue } from "@/lib/gazette"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function GazetteClient({ issues }: { issues: GazetteIssue[] }) {
  const latest = useMemo(() => issues.find((i) => i.isLatest), [issues])
  const archive = useMemo(
    () => issues.filter((i) => !i.isLatest),
    [issues],
  )
  const [showPreview, setShowPreview] = useState(false)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />

        <main className="relative flex-1 overflow-hidden px-4 py-8">
          {/* Atmosphere Background */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-[-15%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-[120px]" />
            <div className="absolute right-[-10%] top-[35%] h-[600px] w-[600px] rounded-full bg-slate-100/40 blur-[140px]" />
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3EaseFilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/baseFilter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
          </div>

          <div className="mx-auto max-w-7xl space-y-12">
            <header>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative overflow-hidden rounded-[2rem] border border-blue-200/60 bg-white p-8 shadow-xl shadow-blue-500/5 dark:border-white/5 dark:bg-[#030712]/80"
              >
                <div className="absolute top-0 right-0 w-[40%] h-full bg-blue-400/5 blur-[80px] pointer-events-none transition-colors group-hover:bg-blue-400/10" />

                <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">
                      Institutional Archive
                    </div>
                    <div className="space-y-1">
                      <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        SECMUN Gazette
                      </h1>
                      <p className="max-w-xl text-sm font-medium text-slate-500 dark:text-zinc-400">
                        The official chronicle of St. Edmund's MUN. Archives of policy boards, bulletins, and gazettes.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </header>

            {/* Featured Section (Latest Issue) */}
            {latest && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative overflow-hidden rounded-[2.5rem] border border-blue-200/60 bg-white shadow-2xl shadow-blue-500/10 dark:border-white/5 dark:bg-zinc-900/40"
              >
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative aspect-[16/9] lg:aspect-auto h-full min-h-[500px] overflow-hidden bg-slate-900">
                    <iframe
                      src={`${latest.filePath}#view=FitH`}
                      className="w-full h-full border-none"
                      title="Latest Gazette Preview"
                      key={latest.filePath}
                    />
                  </div>
                  <div className="p-8 lg:p-12 space-y-8 flex flex-col justify-center">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="rounded-full font-black uppercase tracking-widest text-[10px] bg-emerald-50 text-emerald-700 border-emerald-100">
                          Latest Release
                        </Badge>
                        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <Clock className="w-3 h-3" /> {latest.readingTime} read
                        </span>
                      </div>
                      <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white lg:text-5xl leading-tight">
                        {latest.title}
                      </h2>
                      <p className="text-lg font-medium text-slate-500 dark:text-zinc-400 leading-relaxed">
                        {latest.subtitle}
                      </p>
                      <div className="inline-flex rounded-xl bg-slate-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:bg-white/5">
                        {latest.theme}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-4">
                        <Link
                          href={latest.filePath}
                          target="_blank"
                          className="flex items-center gap-2 text-sm font-black text-blue-600 hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" /> Open Full Screen
                        </Link>
                      </div>
                      <a
                        href={latest.filePath}
                        download
                        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-900 transition-transform hover:scale-105 dark:bg-white/5 dark:border-white/10 dark:text-white"
                      >
                        <ArrowDownToLine className="w-4 h-4" /> Download PDF
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Archive Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Archival Records</h3>
                <p className="text-[10px] font-bold text-slate-400">{archive.length} Issues Indexed</p>
              </div>

              {archive.length === 0 ? (
                <div className="rounded-[2.5rem] border border-dashed border-slate-200 p-12 text-center text-slate-400">
                  Historical records will be indexed upon publication.
                </div>
              ) : (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                >
                  {archive.map((issue, idx) => (
                    <motion.div
                      key={idx}
                      variants={item}
                      whileHover={{ y: -5 }}
                      className="group cursor-pointer space-y-6"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-blue-200/60 bg-slate-50 shadow-lg shadow-blue-500/5 dark:border-white/5 dark:bg-zinc-900/40">
                        <div className="absolute inset-0 flex items-center justify-center opacity-20 transition-opacity group-hover:opacity-40">
                          <Newspaper className="w-32 h-32 text-slate-400" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent flex items-end p-6">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white">{issue.date}</span>
                        </div>
                      </div>
                      <div className="space-y-3 px-2">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="rounded-full font-black uppercase tracking-widest text-[9px] px-2 py-0 border-slate-200 text-slate-500">
                            {issue.readingTime}
                          </Badge>
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{issue.theme}</span>
                        </div>
                        <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {issue.title}
                        </h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 line-clamp-2">
                          {issue.subtitle}
                        </p>
                      </div>
                      <div className="px-2 pt-2">
                        <Link
                          href={issue.filePath}
                          target="_blank"
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline"
                        >
                          Read Issue <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
