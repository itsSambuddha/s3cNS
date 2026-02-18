"use client"

import { motion } from 'framer-motion'
import { SeniorSecretariatCarousel } from '@/components/secretariat/SeniorSecretariatCarousel'
import { SecretariatMembersShowcase } from '@/components/secretariat/SecretariatMembersShowcase'

export default function SecretariatPage() {
  return (
    <div className="relative w-full max-w-[100vw] overflow-x-hidden rounded-3xl bg-background px-4 py-8">
      {/* Atmosphere Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-15%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-[120px]" />
        <div className="absolute right-[-10%] top-[35%] h-[600px] w-[600px] rounded-full bg-slate-100/40 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3EaseFilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/baseFilter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>

      <div className="mx-auto max-w-7xl space-y-16">
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
                  Institutional Leadership
                </div>
                <div className="space-y-1">
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    The Secretariat Portal
                  </h1>
                  <p className="max-w-xl text-sm font-medium text-slate-500 dark:text-zinc-400">
                    Overview of the core leadership and departments for this SEC‑MUN cycle.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </header>

        <SeniorSecretariatCarousel />
        <SecretariatMembersShowcase />
      </div>
    </div>
  )
}
