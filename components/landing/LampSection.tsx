// app/(landing)/_components/LampSection.tsx
"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export function LampSection() {
  return (
    <section className="relative w-full bg-transparent py-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 text-center">
        {/* tube light */}
        <div className="relative mb-10 flex w-full max-w-3xl justify-center">
          <div className="h-[2px] w-full max-w-3xl rounded-full bg-gradient-to-r from-transparent via-sky-400 to-transparent" />
          {/* bright core in the middle */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-6 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/60 blur-xl" />
        </div>

        {/* light cone */}
        <div className="pointer-events-none absolute left-1/2 top-20 h-48 w-[700px] -translate-x-1/2 rounded-[999px] bg-sky-400/18 blur-3xl" />

        {/* content */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, type: "spring", stiffness: 170, damping: 22 }}
          className="relative z-10 space-y-3"
        >
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl dark:text-white">
            Everything your SECMUN secretariat needs.
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
            Clear areas instead of dozens of menus. Each group below expands
            into focused modules inside the dashboard.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
