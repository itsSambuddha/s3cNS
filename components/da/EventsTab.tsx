// components/da/EventsTab.tsx

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

type EventType = "INTRA_SECMUN" | "INTER_SECMUN" | "WORKSHOP" | "EDBLAZON_TIMES"
type EventStatus = "REG_OPEN" | "REG_CLOSED"

interface Event {
  id: string
  name: string
  type: EventType
  status: EventStatus
  registrationDeadline: string | null
  delegateFormLink: string | null
  ambassadorFormLink: string | null
  startDate: string
  endDate: string
  createdAt: string
}

export function EventsTab() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [typeFilter, setTypeFilter] = useState<EventType | "ALL">("ALL")
  const [statusFilter, setStatusFilter] = useState<EventStatus | "ALL">("ALL")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    type: "INTRA_SECMUN" as EventType,
    status: "REG_CLOSED" as EventStatus,
    registrationDeadline: "",
    startDate: "",
    endDate: "",
  })

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("/api/events")
        if (!res.ok) {
          throw new Error(`Failed to fetch events: ${res.status}`)
        }
        const json = await res.json()
        const list = (json.events || []) as Event[]
        setEvents(list)
      } catch (err) {
        console.error("Failed to load events", err)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  async function handleCreateEvent() {
    if (!formData.name.trim()) {
      alert("Please fill in the event name")
      return
    }
    if (!formData.startDate || !formData.endDate) {
      alert("Please provide start and end dates")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          type: formData.type,
          status: formData.status,
          registrationDeadline: formData.registrationDeadline || null,
          startDate: formData.startDate,
          endDate: formData.endDate,
        }),
      })

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}))
        console.error("Failed to create event:", errJson)
        alert(errJson.error || "Failed to create event")
        return
      }

      const json = await res.json()
      const created = json.event as Event
      setEvents((prev) => [created, ...prev])
      setDialogOpen(false)
      setFormData({
        name: "",
        type: "INTRA_SECMUN",
        status: "REG_CLOSED",
        registrationDeadline: "",
        startDate: "",
        endDate: "",
      })
    } catch (err) {
      console.error("Failed to create event", err)
      alert("Error creating event")
    } finally {
      setSubmitting(false)
    }
  }

  const filteredEvents = events.filter((e) => {
    if (typeFilter !== "ALL" && e.type !== typeFilter) return false
    if (statusFilter !== "ALL" && e.status !== statusFilter) return false
    return true
  })

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading events...</div>
  }

  return (
    <div className="space-y-6">
      {/* Filters and actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Select
            value={typeFilter}
            onValueChange={(v) => setTypeFilter(v as EventType | "ALL")}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All types</SelectItem>
              <SelectItem value="INTRA_SECMUN">Intra SECMUN</SelectItem>
              <SelectItem value="INTER_SECMUN">Inter SECMUN</SelectItem>
              <SelectItem value="WORKSHOP">Workshop</SelectItem>
              <SelectItem value="EDBLAZON_TIMES">EdBlazon Times</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as EventStatus | "ALL")}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="REG_OPEN">Registrations Open</SelectItem>
              <SelectItem value="REG_CLOSED">Registrations Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">Create event</Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create new event</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Event name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Intra SECMUN 2025"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type *</label>
                  <Select
                    value={formData.type}
                    onValueChange={(v) =>
                      setFormData({ ...formData, type: v as EventType })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INTRA_SECMUN">Intra SECMUN</SelectItem>
                      <SelectItem value="INTER_SECMUN">Inter SECMUN</SelectItem>
                      <SelectItem value="WORKSHOP">Workshop</SelectItem>
                      <SelectItem value="EDBLAZON_TIMES">
                        EdBlazon Times
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) =>
                      setFormData({ ...formData, status: v as EventStatus })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="REG_OPEN">Registrations Open</SelectItem>
                      <SelectItem value="REG_CLOSED">
                        Registrations Closed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start date *</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">End date *</label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Registration deadline (optional)
                </label>
                <Input
                  type="date"
                  value={formData.registrationDeadline}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registrationDeadline: e.target.value,
                    })
                  }
                />
              </div>

              <Button
                onClick={handleCreateEvent}
                disabled={submitting}
                className="w-full"
                size="lg"
              >
                {submitting ? "Creating..." : "Create event"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Events table */}
      <div className="rounded-lg border border-border/60 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name / ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dates</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-8"
                >
                  No events found
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">
                    <div>{event.name}</div>
                    <button
                      className="mt-1 inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500 hover:bg-slate-200"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(event.id)
                          setCopiedId(event.id)
                          setTimeout(() => setCopiedId(null), 1500)
                        } catch {
                          // ignore
                        }
                      }}
                      title={event.id}
                    >
                      {copiedId === event.id ? "Copied" : `ID: ${event.id.slice(0, 6)}…`}
                    </button>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {event.type.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        event.status === "REG_OPEN" ? "default" : "secondary"
                      }
                    >
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(event.startDate).toLocaleDateString()} –{" "}
                    {new Date(event.endDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
