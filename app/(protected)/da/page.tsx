"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppUser } from "@/hooks/useAppUser"
import { canUseDaModule } from "@/lib/da/access"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EventsTab } from "@/components/da/EventsTab"
import { RegistrationsTab } from "@/components/da/RegistrationsTab"
import { AllotmentsTab } from "@/components/da/AllotmentsTab"
import { PortfoliosTab } from "@/components/da/PortfoliosTab"

interface Event {
  _id: string
  name: string
  code: string
  type: string
  status: string
}

// Stub components
function OverviewTab() {
  return <div className="text-sm text-muted-foreground">Overview tab coming soon...</div>
}

function DelegatesTab() {
  return <div className="text-sm text-muted-foreground">Delegates tab coming soon...</div>
}

function CommunicationTab() {
  return <div className="text-sm text-muted-foreground">Communication tab coming soon...</div>
}

function ExportsTab() {
  return <div className="text-sm text-muted-foreground">Exports tab coming soon...</div>
}

function SettingsTab() {
  return <div className="text-sm text-muted-foreground">Settings tab coming soon...</div>
}

export default function DaPage() {
  const router = useRouter()
  const { user: appUser, loading } = useAppUser()
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("events")
  const [eventsLoading, setEventsLoading] = useState(true)

  // Load events
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("/api/events")
        if (res.ok) {
          const data = await res.json()
          setEvents(data)
        }
      } catch (err) {
        console.error("Failed to load events", err)
      } finally {
        setEventsLoading(false)
      }
    }

    loadEvents()
  }, [])

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  if (!appUser || !canUseDaModule(appUser)) {
    router.replace("/dashboard")
    return null
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Delegate Affairs</h1>
          <p className="text-sm text-muted-foreground">
            Manage SECMUN events, registrations, allotments, and communications.
          </p>
        </header>

        {/* Event selector */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Select event:</label>
          <Select value={selectedEventId ?? ""} onValueChange={setSelectedEventId}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="No event selected" />
            </SelectTrigger>
            <SelectContent>
              {eventsLoading ? (
                <div className="px-2 py-1 text-xs text-muted-foreground">Loading...</div>
              ) : events.length === 0 ? (
                <div className="px-2 py-1 text-xs text-muted-foreground">
                  No events found. Create one in the Events tab.
                </div>
              ) : (
                events.map((event) => (
                  <SelectItem key={event._id} value={event._id}>
                    {event.name} ({event.code})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
            <TabsTrigger value="allotments">Allotments</TabsTrigger>
            <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
            <TabsTrigger value="delegates">Delegates</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="exports">Exports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <div className="mt-6 rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-xl">
            <TabsContent value="overview" className="mt-0">
              <OverviewTab />
            </TabsContent>
            <TabsContent value="events" className="mt-0">
              <EventsTab />
            </TabsContent>
            <TabsContent value="registrations" className="mt-0">
              <RegistrationsTab selectedEventId={selectedEventId} />
            </TabsContent>
            <TabsContent value="allotments" className="mt-0">
              <AllotmentsTab selectedEventId={selectedEventId} />
            </TabsContent>
            <TabsContent value="portfolios" className="mt-0">
              <PortfoliosTab selectedEventId={selectedEventId} />
            </TabsContent>
            <TabsContent value="delegates" className="mt-0">
              <DelegatesTab />
            </TabsContent>
            <TabsContent value="communication" className="mt-0">
              <CommunicationTab />
            </TabsContent>
            <TabsContent value="exports" className="mt-0">
              <ExportsTab />
            </TabsContent>
            <TabsContent value="settings" className="mt-0">
              <SettingsTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  )
}
