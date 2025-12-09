// app/(landing)/_components/SecmunGlobe.tsx
'use client'

import { motion } from 'motion/react'
import dynamic from 'next/dynamic'

const World = dynamic(() => import('@/components/ui/globe').then(m => m.World), {
  ssr: false,
})

export function SecmunGlobe() {
  const globeConfig = {
  autoRotateSpeed: 0.6,
  globeColor: '#0b1f4b',
}

  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 md:flex-row md:items-center md:justify-between">
        {/* Left: text */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl space-y-3 text-center md:text-left"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-600">
            Global‑ready SEC‑MUN
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
            One workspace, wherever the Secretariat is.
          </h2>
          <p className="text-sm text-slate-600">
            Budgets, proposals, and documents live in a single shared system.
            Whether the team is on campus or travelling for conferences,
            everyone works off the same source of truth.
          </p>
        </motion.div>

        {/* Right: full circular globe */}
       <motion.div
  // ...
  className="relative flex w-full max-w-sm items-center justify-center md:max-w-md"
>
  <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-sky-200/40 via-transparent to-blue-200/40 blur-3xl" />
  <div className="relative aspect-square w-full">
    <World globeConfig={globeConfig} />
  </div>
</motion.div>

      </div>
    </section>
  )
}
