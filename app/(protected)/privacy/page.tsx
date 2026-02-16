// app/(protected)/privacy/page.tsx
'use client'

import { motion } from "framer-motion"
import { ShieldCheck, Lock, Eye, FileText } from "lucide-react"

export default function PrivacyPage() {
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
                  Legal Compliance
                </div>
                <div className="space-y-1">
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    Privacy Policy
                  </h1>
                  <p className="max-w-xl text-sm font-medium text-slate-500 dark:text-zinc-400">
                    How the SECMUN Control Room handles information about you and your Secretariat.
                  </p>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/20">
                <ShieldCheck className="w-6 h-6" />
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
                icon: <Lock className="w-4 h-4" />,
                title: "1. Information collected",
                content: "SECMUN Control Room stores only the data needed to run conferences and internal Secretariat work, such as user accounts, role assignments, event details, and financial records that you enter into the system."
              },
              {
                icon: <Eye className="w-4 h-4" />,
                title: "2. How information is used",
                content: "Data is used solely to provide features like dashboards, notifications, archives, and analytics for your Secretariat. It is not sold or shared with third-party advertisers."
              },
              {
                icon: <ShieldCheck className="w-4 h-4" />,
                title: "3. Data access and retention",
                content: "Access to the workspace is limited to Secretariat members and other roles you explicitly grant. Records are retained for institutional memory unless the Secretariat or college administration requests removal."
              },
              {
                icon: <FileText className="w-4 h-4" />,
                title: "4. Contact",
                content: "For any questions about this policy or data requests, contact the Secretariat at secretariat@secmun.in"
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
