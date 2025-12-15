"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RegistrationsTab } from "@/components/da/RegistrationsTab"

export default function DaPage() {
  const [activeTab, setActiveTab] = useState("registrations")
  const [selectedEventType, setSelectedEventType] = useState<string | undefined>(
    undefined,
  )

  return (
    <main className="min-h-screen bg-background px-4 py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <h1 className="text-3xl font-semibold">Delegate Affairs</h1>
          <p className="text-sm text-muted-foreground">
            Manage registrations and communication.
          </p>
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
              <div className="text-sm text-muted-foreground">
                Overview coming next.
              </div>
            </TabsContent>

            <TabsContent value="events" className="mt-0">
              <div className="text-sm text-muted-foreground">
                Events management unchanged.
              </div>
            </TabsContent>

            <TabsContent value="committee" className="mt-0">
              <div className="text-sm text-muted-foreground">
                Committee size calculator (next step).
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  )
}
