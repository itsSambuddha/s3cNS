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
type EventStatus = "PLANNING" | "REG_OPEN" | "RUNNING" | "COMPLETED" | "ARCHIVED"

interface Event {
  _id: string
  name: string
  code: string
  type: EventType
  status: EventStatus
  startDate: string
  endDate: string
  venue: string
}

export function EventsTab() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [typeFilter, setTypeFilter] = useState<EventType | "ALL">("ALL")
  const [statusFilter, setStatusFilter] = useState<EventStatus | "ALL">("ALL")

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "INTRA_SECMUN" as EventType,
    startDate: "",
    endDate: "",
    venue: "",
    owningOffice: "",
    status: "PLANNING" as EventStatus,
  })

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
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  async function handleCreateEvent() {
    if (!formData.name || !formData.code || !formData.startDate || !formData.endDate || !formData.venue) {
      alert("Please fill in all required fields")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          startDate: new Date(formData.startDate),
          endDate: new Date(formData.endDate),
        }),
      })

      if (res.ok) {
        const newEvent = await res.json()
        setEvents([newEvent, ...events])
        setDialogOpen(false)
        setFormData({
          name: "",
          code: "",
          type: "INTRA_SECMUN",
          startDate: "",
          endDate: "",
          venue: "",
          owningOffice: "",
          status: "PLANNING",
        })
      } else {
        alert("Failed to create event")
      }
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
              <SelectItem value="PLANNING">Planning</SelectItem>
              <SelectItem value="REG_OPEN">Registrations Open</SelectItem>
              <SelectItem value="RUNNING">Running</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">Create event</Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create new event</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Row 1: Name and Code */}
              <div className="grid gap-4 sm:grid-cols-2">
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">Event code *</label>
                  <Input
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="e.g., INTRA25"
                  />
                </div>
              </div>

              {/* Row 2: Type and Status */}
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
                      <SelectItem value="EDBLAZON_TIMES">EdBlazon Times</SelectItem>
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
                      <SelectItem value="PLANNING">Planning</SelectItem>
                      <SelectItem value="REG_OPEN">Registrations Open</SelectItem>
                      <SelectItem value="RUNNING">Running</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 3: Start and End dates */}
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

              {/* Row 4: Venue and Owning office */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Venue *</label>
                  <Input
                    value={formData.venue}
                    onChange={(e) =>
                      setFormData({ ...formData, venue: e.target.value })
                    }
                    placeholder="e.g., SECMUN Hall"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Owning office</label>
                  <Input
                    value={formData.owningOffice}
                    onChange={(e) =>
                      setFormData({ ...formData, owningOffice: e.target.value })
                    }
                    placeholder="e.g., DA, Events"
                  />
                </div>
              </div>

              {/* Action button */}
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
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Venue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No events found
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents.map((event) => (
                <TableRow key={event._id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell className="text-sm">{event.code}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{event.type.replace("_", " ")}</Badge>
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
                  <TableCell className="text-sm">{event.venue}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
