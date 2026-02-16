// app/(protected)/terms/page.tsx
'use client'

import { motion } from "framer-motion"
import { Scale, ShieldAlert, FileCheck, Info, RefreshCw, Gavel } from "lucide-react"

export default function TermsPage() {
  return (
    <main className="relative min-h-screen bg-background px-4 py-8 overflow-hidden">
      {/* Atmosphere Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-15%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-[120px]" />
        <div className="absolute right-[-10%] top-[35%] h-[600px] w-[600px] rounded-full bg-slate-100/40 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3EaseFilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/baseFilter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>

      <div className="mx-auto max-w-4xl space-y-12">
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
                  Legal Framework
                </div>
                <div className="space-y-1">
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    Terms & Conditions
                  </h1>
                  <p className="max-w-xl text-sm font-medium text-slate-500 dark:text-zinc-400">
                    Proprietary terms governing the use of the SECMUN Control Room platform.
                  </p>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/20">
                <Gavel className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2.5rem] border border-blue-200/60 bg-white p-8 sm:p-12 shadow-2xl shadow-blue-500/5 dark:border-white/5 dark:bg-zinc-900/40"
        >
          <div className="space-y-12">
            {[
              {
                icon: <Scale className="w-4 h-4" />,
                title: "1. Use of the platform",
                content: "The platform is intended for internal use by the SECMUN Secretariat and related college bodies. You agree not to misuse the system, attempt to break security, or use it for unlawful activities."
              },
              {
                icon: <ShieldAlert className="w-4 h-4" />,
                title: "2. Accounts and access",
                content: "Secretariat members are responsible for keeping their accounts secure and for actions taken under their logins. Access can be revoked by the Secretariat or college administration at any time."
              },
              {
                icon: <FileCheck className="w-4 h-4" />,
                title: "3. Data ownership",
                content: "Conference and financial data entered into the platform remain the property of St. Edmund's College and the SECMUN Secretariat. The developer may use anonymised, aggregated data to improve the system."
              },
              {
                icon: <Info className="w-4 h-4" />,
                title: "4. Limitation of liability",
                content: "The platform is provided on a best-effort basis. There is no guarantee of uninterrupted availability, and the developer is not liable for indirect or consequential losses arising from its use."
              },
              {
                icon: <RefreshCw className="w-4 h-4" />,
                title: "5. Changes to these terms",
                content: "These terms may be updated when the platform changes or college requirements evolve. Continued use of the platform after updates means you accept the new terms."
              }
            ].map((section, idx) => (
              <section key={idx} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 dark:bg-white/5">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">{section.title}</h2>
                </div>
                <p className="pl-11 text-sm font-medium leading-relaxed text-slate-500 dark:text-zinc-400">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  )
}
