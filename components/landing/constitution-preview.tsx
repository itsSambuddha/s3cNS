"use client"

import Link from "next/link"
import { motion } from "motion/react"

export function ConstitutionPreview() {
  return (
    <section className="mx-auto mt-24 max-w-7xl px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50/70 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-white/5 dark:from-zinc-900 dark:via-zinc-900/50 dark:to-zinc-800/20"
      >
        {/* soft blue glow - Colors Preserved */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-[-10%] h-[60%] w-[40%] rounded-full bg-blue-300/10 blur-[120px]" />
          <div className="absolute right-[-5%] bottom-[-10%] h-[60%] w-[40%] rounded-full bg-sky-200/20 blur-[120px]" />
        </div>

        <div className="relative grid gap-16 p-10 sm:p-14 lg:grid-cols-[1.8fr_1.2fr] items-center">
          {/* LEFT: copy + CTA */}
          <div className="flex flex-col gap-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-blue-200 bg-blue-50/70 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-blue-700">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                Foundational document
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl leading-[1.1]">
                  SECMUN Secretariat <br className="hidden md:block" />
                  Mandate & Constitution
                </h2>
                <p className="max-w-xl text-lg text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                  A single, versioned governance framework defining Secretariat
                  roles, reporting lines, procedures, and the formal SECMUN
                  Constitution.
                </p>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Version", value: "1.0", detail: "Secretarial Year 2025–26" },
                  { label: "Document type", value: "Institutional Governance", detail: "Mandate + Constitution" },
                  { label: "Maintained by", value: "General Secretary", detail: "Archival & revisions" }
                ].map((item, i) => (
                  <div key={i} className="group relative rounded-2xl border border-slate-200/60 bg-white/50 p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 dark:border-white/5 dark:bg-white/5">
                    <dt className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                      {item.label}
                    </dt>
                    <dd className="text-base font-bold text-blue-700 dark:text-blue-400">
                      {item.value}
                    </dd>
                    <dd className="mt-1 text-[11px] font-medium text-slate-500 dark:text-zinc-500">
                      {item.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/constitution">
                <button className="h-14 px-10 rounded-full bg-slate-900 text-white font-bold text-sm shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all hover:scale-[1.03] active:scale-95">
                  View full document
                </button>
              </Link>
              <div className="inline-flex items-center gap-3 rounded-full border border-slate-200/60 bg-white/80 px-5 py-2 text-[11px] font-bold text-slate-600 shadow-sm dark:bg-zinc-800 dark:text-zinc-400 dark:border-white/5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Ratified by Core Panel & Teacher‑in‑Charge
              </div>
            </div>
          </div>

          {/* RIGHT: mandate + constitution mini layout - Colors preserved */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="absolute -inset-10 bg-gradient-to-br from-blue-100/50 via-sky-50/50 to-slate-50/50 blur-[40px] rounded-full pointer-events-none" />

            <div className="relative z-10 space-y-4 rounded-[2.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_32px_64px_-16px_rgba(15,23,42,0.15)] dark:bg-zinc-900 dark:border-white/10">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Governance Snapshot
                </span>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black text-blue-700 uppercase tracking-wider">
                  Mandate · Rev 1.0
                </span>
              </div>

              <div className="grid gap-3">
                <div className="rounded-3xl border border-blue-100 bg-blue-50/50 p-5 dark:bg-blue-500/5 dark:border-blue-500/10">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700 mb-2">
                    Secretariat
                  </p>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                    Senior panel, USG Offices, and Junior Secretariat roles and
                    hierarchy.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-5 dark:bg-white/5 dark:border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 dark:text-zinc-300 mb-2">
                    Articles 1–13
                  </p>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                    Name & Purpose, Membership, Finance, Code of Conduct, and
                    more.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-3xl border border-slate-100 bg-slate-50/30 px-5 py-4 dark:bg-white/5 dark:border-white/5">
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Access Link
                  </p>
                  <p className="text-[11px] font-bold text-slate-900 dark:text-white">
                    Official Source of Truth
                  </p>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black text-emerald-700 uppercase tracking-wider dark:bg-emerald-500/10 dark:text-emerald-400">
                    Live
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>

  )
}
