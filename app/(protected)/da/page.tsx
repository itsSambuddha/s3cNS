"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RegistrationsTab } from "@/components/da/RegistrationsTab"
import { EventsTab } from "@/components/da/EventsTab"
import {OverviewTab} from "@/components/da/OverviewTab"
import {CommitteeTab} from "@/components/da/CommitteeTab"
import { motion } from "framer-motion"
import Button from "@/components/base/Button"

export default function DaPage() {
  const [activeTab, setActiveTab] = useState("registrations")
  const [selectedEventType, setSelectedEventType] = useState<string | undefined>(
    undefined,
  )
  const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
}

  return (
    <main className="min-h-screen bg-background px-4 py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
      <motion.div
        variants={scaleIn}
        className="flex flex-col gap-3 rounded-2xl border bg-gradient-to-r from-slate-50 via-background to-emerald-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-5"
      >
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700/80">
            DELEGATE AFFAIRS MODULE
          </p>
          <h1 className="text-xl font-semibold sm:text-2xl">
            The Psuedo-Ultimate DA Toolkit
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            View and manage all DA records along with Gmail and WhatsApp integration.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          
        </div>
      </motion.div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
            <TabsTrigger value="committee">Committee</TabsTrigger>
          </TabsList>

          <div className="mt-6 rounded-2xl border border-border bg-card p-6">
            <TabsContent value="registrations" className="mt-0">
              <RegistrationsTab selectedEventType={selectedEventType} />
            </TabsContent>

            {/* Other tabs stay untouched */}
            <TabsContent value="overview" className="mt-0">
              <OverviewTab />
            </TabsContent>

            <TabsContent value="events" className="mt-0">
              <EventsTab/>
            </TabsContent>

            <TabsContent value="committee" className="mt-0">
              <CommitteeTab/>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  )
}
