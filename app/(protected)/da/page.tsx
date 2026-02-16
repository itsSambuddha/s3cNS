// app/(protected)/da/page.tsx

"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RegistrationsTab } from "@/components/da/RegistrationsTab"
import { EventsTab } from "@/components/da/EventsTab"
import { OverviewTab } from "@/components/da/OverviewTab"
import { CommitteeTab } from "@/components/da/CommitteeTab"
import { motion } from "framer-motion"

export default function DaPage() {
  const [activeTab, setActiveTab] = useState("registrations")
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1 },
  }

  return (
    <main className="relative min-h-screen bg-background px-4 py-8 overflow-hidden">
      {/* Atmosphere Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-15%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-[120px]" />
        <div className="absolute right-[-10%] top-[35%] h-[600px] w-[600px] rounded-full bg-emerald-100/40 blur-[140px]" />
        {/* Grainy Texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3BaseFilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/baseFilter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>

      <div className="mx-auto max-w-7xl space-y-12">
        <header>
          <motion.div
            variants={scaleIn}
            className="group relative overflow-hidden rounded-[2rem] border border-blue-200/60 bg-white p-8 shadow-xl shadow-blue-500/5 dark:border-white/5 dark:bg-[#030712]/80"
          >
            <div className="absolute top-0 right-0 w-[40%] h-full bg-emerald-400/5 blur-[80px] pointer-events-none transition-colors group-hover:bg-emerald-400/10" />

            <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
                  Delegate Affairs Module
                </div>
                <div className="space-y-1">
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    DA Management Toolkit
                  </h1>
                  <p className="max-w-xl text-sm font-medium text-slate-500 dark:text-zinc-400">
                    View and manage all DA records along with Gmail and WhatsApp integration.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="inline-flex h-14 w-full items-center justify-start gap-2 rounded-3xl border border-blue-200/20 bg-slate-100/50 p-2 text-slate-500 dark:bg-white/5 sm:w-auto">
            {["overview", "events", "registrations", "committee"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-[1.25rem] px-6 py-2 text-xs font-black uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-white"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="rounded-[2.5rem] border border-blue-200/60 bg-white p-8 shadow-xl shadow-blue-500/5 dark:border-white/5 dark:bg-[#030712]/40 backdrop-blur-sm">
            {/* Simple event selector shared across tabs */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Selected Event ID:</span>
              <input
                className="w-64 rounded border px-2 py-1 text-xs"
                placeholder="Paste eventId here (optional)"
                value={selectedEventId ?? ""}
                onChange={(e) =>
                  setSelectedEventId(e.target.value ? e.target.value : null)
                }
              />
            </div>

            <TabsContent value="registrations" className="mt-0">
              <RegistrationsTab />
            </TabsContent>

            <TabsContent value="overview" className="mt-0">
              <OverviewTab />
            </TabsContent>

            <TabsContent value="events" className="mt-0">
              <EventsTab />
            </TabsContent>

            <TabsContent value="committee" className="mt-0">
              <CommitteeTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  )
}
