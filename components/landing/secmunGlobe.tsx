// app/(landing)/_components/SecmunGlobe.tsx
'use client'

import { motion } from 'motion/react'
import dynamic from 'next/dynamic'
import WorldMap from '@/components/ui/world-map'

const World = dynamic(() => import('@/components/ui/globe').then((m) => m.World), {
  ssr: false,
})

export function SecmunGlobe() {
  const globeConfig = {
    autoRotateSpeed: 0.6,
    globeColor: '#0b1f4b',
  }

  const mapDots = [
    {
      start: { lat: 64.2008, lng: -149.4937 },
      end: { lat: 34.0522, lng: -118.2437 },
    },
    {
      start: { lat: 64.2008, lng: -149.4937 },
      end: { lat: -15.7975, lng: -47.8919 },
    },
    {
      start: { lat: -15.7975, lng: -47.8919 },
      end: { lat: 38.7223, lng: -9.1393 },
    },
    {
      start: { lat: 51.5074, lng: -0.1278 },
      end: { lat: 28.6139, lng: 77.209 },
    },
    {
      start: { lat: 28.6139, lng: 77.209 },
      end: { lat: 43.1332, lng: 131.9113 },
    },
    {
      start: { lat: 28.6139, lng: 77.209 },
      end: { lat: -1.2921, lng: 36.8219 },
    },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#e3edf9] via-[#eef3fb] to-[#dde8f6] py-16 md:py-20 dark:bg-black">
      {/* world-map background under everything */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-y-6 inset-x-0">
          <div className="mx-auto h-full max-w-6xl rounded-[40px] bg-gradient-to-br from-white/90 via-[#dde6f5]/95 to-white/90 shadow-[0_40px_120px_rgba(15,23,42,0.15)] dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900">
            <div className="relative h-full w-full opacity-85">
              <WorldMap dots={mapDots} />
            </div>
          </div>
        </div>
      </div>

      {/* foreground content */}
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 md:flex-row md:items-center md:justify-between">
        {/* Left: text */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.45, type: 'spring', stiffness: 160, damping: 22 }}
          className="max-w-xl space-y-3 text-center md:text-left"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-600">
            Global‑ready SEC‑MUN
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl dark:text-white">
            One workspace, wherever the Secretariat is.
          </h2>
          <p className="text-sm text-slate-600 dark:text-neutral-300 md:text-base">
            Budgets, proposals, and documents live in a single shared system.
            Whether the team is on campus or travelling for conferences, everyone
            works off the same source of truth.
          </p>
        </motion.div>

        {/* Right: globe with subtle bounce */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 160, damping: 20 }}
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
