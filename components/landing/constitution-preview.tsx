"use client"

import Link from "next/link"
import { motion } from "motion/react"

export function ConstitutionPreview() {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50/70 shadow-[0_18px_60px_rgba(15,23,42,0.12)]"
      >
        {/* soft blue glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-0 h-40 w-40 rounded-full bg-blue-300/20 blur-3xl" />
          <div className="absolute right-[-10%] bottom-[-20%] h-56 w-56 rounded-full bg-sky-200/30 blur-3xl" />
        </div>

        <div className="relative grid gap-10 px-6 py-8 sm:px-9 sm:py-9 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.5fr)]">
          {/* LEFT: copy + CTA */}
          <div className="flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-700">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Foundational document
              </div>

              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  SECMUN Secretariat Mandate & Constitution
                </h2>
                <p className="mt-2 max-w-xl text-sm text-slate-600">
                  A single, versioned governance framework defining Secretariat
                  roles, reporting lines, procedures, and the formal SECMUN
                  Constitution.
                </p>
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-3 text-[11px] text-slate-700 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm">
                  <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
                    Version
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-blue-700">
                    1.0
                  </dd>
                  <dd className="mt-0.5 text-[10px] text-slate-500">
                    Secretarial Year 2025–26
                  </dd>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm">
                  <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
                    Document type
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-blue-700">
                    Institutional Governance
                  </dd>
                  <dd className="mt-0.5 text-[10px] text-slate-500">
                    Mandate + Constitution
                  </dd>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm">
                  <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
                    Maintained by
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-blue-700">
                    General Secretary
                  </dd>
                  <dd className="mt-0.5 text-[10px] text-slate-500">
                    Archival & revisions
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/constitution"
                className="inline-flex h-9 items-center justify-center rounded-full bg-slate-900 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                View full document
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[10px] text-slate-600 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Ratified by Core Panel & Teacher‑in‑Charge
              </div>
            </div>
          </div>

          {/* RIGHT: mandate + constitution mini layout */}
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative flex items-center justify-center"
          >
            <div className="pointer-events-none absolute inset-3 rounded-3xl bg-gradient-to-br from-blue-100 via-blue-50 to-slate-50 blur-sm" />

            <div className="relative z-10 grid w-full max-w-sm grid-rows-[auto_auto_1fr] gap-3 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span className="font-medium text-slate-900">
                  Governance snapshot
                </span>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                  Mandate · Constitution
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-700">
                    Secretariat
                  </p>
                  <p className="mt-1 text-[11px] text-slate-700">
                    Senior panel, USG Offices, and Junior Secretariat roles and
                    hierarchy.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-700">
                    Articles 1–13
                  </p>
                  <p className="mt-1 text-[11px] text-slate-700">
                    Name & Purpose, Membership, Finance, Code of Conduct, and
                    more.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Access
                  </p>
                  <p className="text-[11px]">
                    Single source of truth for SECMUN governance.
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                    Versioned
                  </span>
                  <span className="text-[9px] text-slate-500">
                    Archived by General Secretary
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
